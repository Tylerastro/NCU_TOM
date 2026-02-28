import { Octokit } from "@octokit/core";
import { OctokitResponse } from "@octokit/types";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export async function createIssue(
  title: string,
  body: string
): Promise<OctokitResponse<unknown>> {
  return await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner: "Tylerastro",
    repo: "NCU_TOM",
    title,
    body,
    assignees: [],
    labels: ["bug"],
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}
