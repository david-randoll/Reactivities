import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { ActivityFormValues } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

const ActivityForm = () => {
    const history = useHistory();
    const { activityStore } = useStore();
    const { loadingInitial, createActivity, updateActivity, loadActivity, setLoadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required("The activity title is required"),
        description: Yup.string().required("The activity description is required"),
        category: Yup.string().required(),
        date: Yup.string().required("Date is required").nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    });

    useEffect(() => {
        if (id) loadActivity(id).then((a) => setActivity(new ActivityFormValues(a)));
        else setLoadingInitial(false);
    }, [id, loadActivity, setLoadingInitial]);

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid(),
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    if (loadingInitial) return <Loading content="Loading activity..." />;

    return (
        <Segment clearing>
            <Header content="Activity Details" color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={(values) => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput name="title" placeholder="Title" label="Title" />
                        <MyTextArea rows={3} placeholder="Description" name="description" label="Description" />
                        <MySelectInput options={categoryOptions} placeholder="Category" name="category" label="Category" />
                        <MyDateInput
                            placeholderText="Date"
                            name="date"
                            label="Date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <Header content="Location Details" color="teal" />
                        <MyTextInput placeholder="City" name="city" label="City" />
                        <MyTextInput placeholder="Venue" name="venue" label="Venue" />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}
                            floated="right"
                            positive
                            type="submit"
                            content="Submit"
                        />
                        <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
};

export default observer(ActivityForm);
