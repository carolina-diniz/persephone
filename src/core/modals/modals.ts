import { submits_reception } from "../../module/reception";
import { submits_share_code } from "../../module/share-code";

export const modals = {
  ...submits_share_code,
  ...submits_reception,
};
