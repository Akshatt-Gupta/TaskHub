import {useMutation} from "@tanstack/react-query";
import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import type { W } from "node_modules/react-router/dist/development/route-data-D7Xbr_Ww.mjs";
import { postData } from "@/lib/fetch-util";

export const useCreateWorkspace = () => {
  return useMutation({
   
    mutationFn: async (data:WorkspaceForm) => postData("/workspaces",data),
  });

  
};