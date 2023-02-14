import type { SubjectEditFields } from "$data/dbUtils";
import { saveSubject, deleteSubject } from "$data/subjects";
import { toJson } from "$lib/util/formDataHelpers";

export const actions = {
  async saveSubject({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["_id", "name", "parentId", "path", "backgroundColor", "textColor", "originalParentId"]
    }) as SubjectEditFields & { _id: string };

    await saveSubject(session.userId, fields._id, fields);
  },
  async deleteSubject({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();
    const _id = formData.get("_id")!;

    await deleteSubject(session.userId, _id);
  }
};