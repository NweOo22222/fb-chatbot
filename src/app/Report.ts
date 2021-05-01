import Axios from "axios";

export default class Report {
  static send(phone: string, message: string) {
    message = message.replace(/#n[we]{2}oo/gim, "");
    if (!(message && message.length)) {
      throw new Error("message body is required");
    }
    return Axios.post("https://api.nweoo.com/report", {
      phone,
      message,
      timestamp: Date.now(),
    }).then(({ data: { id, post_id } }) => ({
      id: id.toString(),
      post_id,
    }));
  }

  static remove(id: string | number, token: string | number) {
    return Axios.delete(
      `https://api.nweoo.com/report/${id}?phone=${token}`
    ).then(({ data }) => data);
  }
}
