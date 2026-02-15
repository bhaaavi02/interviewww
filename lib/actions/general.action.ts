"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback({
  interviewId,
  userId,
  transcript,
  feedbackId,
}: CreateFeedbackParams) {

  // existing feedback logic
  const feedback = await db.feedback.create({
    data: {
      interviewId,
      userId,
      transcript,
    },
  });

  // ✅ ADD THIS HERE
  await db.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      finalized: true,
    },
  });

  return feedback;
}


export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

// export async function getLatestInterviews(
//   params: GetLatestInterviewsParams
// ): Promise<Interview[] | null> {
//   const { userId, limit = 20 } = params;

//   const interviews = await db
//     .collection("interviews")
//     .orderBy("createdAt", "desc")
//     .where("finalized", "==", true)
//     .where("userId", "!=", userId)
//     .limit(limit)
//     .get();

//   return interviews.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Interview[];
// }


export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  // Fetch more documents to compensate for filtering
  const snapshot = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limit * 2) // fetch extra to ensure we still get enough after filtering
    .get();

  const filtered = snapshot.docs
    .filter((doc) => doc.data().userId !== userId)
    .slice(0, limit);

  return filtered.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}


export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
} 