import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity.interface";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();

            activities.forEach((activity: Activity) => {
                this.setActivity(activity);
            });
            this.setLoadingInitial(false);
        } catch (err) {
            console.log(err);
            this.setLoadingInitial(false);
        }
    };

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.setSelectedActivity(activity);
            return activity;
        } else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.setSelectedActivity(activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (err) {
                console.log(err);
                this.setLoadingInitial(false);
            }
        }
    };

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split("T")[0];
        this.activityRegistry.set(activity.id, activity);
    };

    private setSelectedActivity = (activity: Activity | undefined) => {
        this.selectedActivity = activity;
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.setSelectedActivity(activity);
                this.editMode = false;
                this.loading = false;
            });
        } catch (err) {
            console.log(err);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.setSelectedActivity(activity);
                this.editMode = false;
                this.loading = false;
            });
        } catch (err) {
            console.log(err);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            });
        } catch (err) {
            console.log(err);
            runInAction(() => {
                this.loading = false;
            });
        }
    };
}
