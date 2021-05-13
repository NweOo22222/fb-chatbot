import e from "express";

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
  from: Actor;
  verb: "add" | "edit" | "update" | "remove";
  item?: "like";
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

const { FACEBOOK_PAGE_ID } = process.env;

export default class Feed {
  constructor(public context: Context) {}

  handle() {
    let context = this.context;
    if (context.from.id != FACEBOOK_PAGE_ID) {
      return;
    }
    if ("post_id" in context) {
    } else if ("photo" in context) {
      console.log("changed: photo");
    } else if ("video" in context) {
      console.log("changed: video");
    } else {
      console.log("changed: unspported");
    }
    console.log(" -", ...Object.keys(context));
  }
}