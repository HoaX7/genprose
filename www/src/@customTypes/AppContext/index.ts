import { StatusObject } from "@customTypes/Ai";
import { ProfileProps } from "@customTypes/Profile";

export type InitialAppContextProps = {
    profile: ProfileProps;
    isLoggedIn: boolean;
    globalStatus: StatusObject[];
    queueMessage: string;
}

export type ActionDispatchParams<T> = {
    type: string;
    payload?: T
}
export type ActionDispatchProps = <T>(params: ActionDispatchParams<T>) => void;

export type ActionCreatorProps = {
    setProfile: (props: ProfileProps) => void;
    logout: () => void;
    setGlobalStatus: (props: StatusObject[]) => void;
    setQueueMessage: (props: string) => void;
}