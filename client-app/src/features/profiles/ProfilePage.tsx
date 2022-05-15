import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import Loading from "../../app/layout/Loading";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { profileStore } = useStore();
    const { loadProfile, loadingProfile, profile } = profileStore;

    useEffect(() => {
        loadProfile(username);
    }, [loadProfile, username]);

    if (loadingProfile) return <Loading content="Loading profile..." />;

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile && (
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
};

export default observer(ProfilePage);
