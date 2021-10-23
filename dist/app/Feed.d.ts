interface Actor {
    id: string;
    name?: string;
}
interface PagePost {
    status_type?: string;
    is_published?: boolean;
    updated_time?: string | number;
    permalink_url?: string;
}
interface Context {
    verb: "add" | "edit" | "update" | "remove";
    item: "like" | "reaction" | "comment" | "post" | "photo" | "video";
    from?: Actor;
    post_id?: string;
    object_id?: string;
    created_time?: number;
    edited_time?: string | number;
    post?: PagePost;
    is_hidden?: boolean;
    link?: string;
    message?: string;
    photo_ids?: string;
    photos?: string;
    story?: string;
    title?: string;
    video_flag_reason?: number;
    comment_id?: string;
    event_id?: string;
    open_graph_story_id?: string;
    parent_id?: string;
    photo_id?: string;
    reaction_type?: string;
    published?: number;
    share_id?: string;
    video_id?: string;
}
export default class Feed {
    context: Context;
    constructor(context: Context);
    handle(): void;
    handleComment(): void;
    handleAddedPost(): void;
}
export {};
//# sourceMappingURL=Feed.d.ts.map