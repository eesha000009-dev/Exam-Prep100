const admin = require('firebase-admin');
const { onRequest } = require('@vercel/node');
const axios = require('axios');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

async function getUserProfile(userId) {
  const doc = await admin.firestore().collection('users').doc(userId).get();
  return doc.exists ? doc.data() : {};
}

async function saveUserProfile(userId, data) {
  await admin.firestore().collection('users').doc(userId).set(data, { merge: true });
}

module.exports = onRequest(async (req, res) => {
  const { userId, action, payload } = req.body;
  if (!userId || !action) return res.status(400).json({ error: 'Missing userId or action' });

  let userProfile = await getUserProfile(userId);

  if (action === 'analyze') {
    // TODO: Integrate with your AI model/service for analysis
    return res.json({
      welcomeMessage: `Hi ${userProfile.name || 'Learner'}, keep going!`,
      quest: {
        desc: 'Complete your daily quest to earn XP and unlock rewards!',
        tasks: [
          { text: 'Finish 3 practice questions', done: false },
          { text: 'Watch 2 video lessons', done: false },
          { text: 'Update your study plan', done: false }
        ],
        progress: 'Progress: 0/3',
        rewardAvailable: false
      },
      weeklyProgress: 0,
      weeklyTasks: '0/0 Tasks Completed',
      mockScore: 0,
      mockLabel: 'No data yet.'
    });
  }

  if (action === 'study-plan') {
    // TODO: Integrate with AI to generate personalized study plan
    const plan = {
      plan: [
        { day: 'Monday', topics: ['Math: Algebra', 'English: Comprehension'] },
        { day: 'Tuesday', topics: ['Biology: Cells', 'Chemistry: Atoms'] }
      ],
      advice: 'Try to study at your best time of day!'
    };
    await saveUserProfile(userId, { studyPlan: plan });
    return res.json(plan);
  }

  if (action === 'tutor') {
    // TODO: Integrate with AI for personalized Q&A
    const { question } = payload || {};
    return res.json({
      answer: `CORTEX AI says: Sorry, I can't answer "${question}" yet.`,
      motivation: 'Keep asking questions, you are doing great!'
    });
  }

  res.status(400).json({ error: 'Unknown action' });
});

