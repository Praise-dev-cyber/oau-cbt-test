import fs from 'fs';

const SUPABASE_URL = 'https://iilxeszdtjhttfmjqxxd.supabase.co';
const SECRET_KEY = 'sb_secret_v-PX3Nvof75dSOklrttYFQ_3pA9tJHs'; // Your secret key

async function seed() {
  console.log('🚀 Starting import via REST API...');

  // 1. Read JSON
  const rawData = fs.readFileSync('./src/questions.json', 'utf-8');
  const questionsData = JSON.parse(rawData);

  // 2. Fetch Subjects
  const subjRes = await fetch(`${SUPABASE_URL}/rest/v1/subjects?select=id,name`, {
    headers: {
      'apikey': SECRET_KEY,
      'Authorization': `Bearer ${SECRET_KEY}`,
    }
  });

  const subjects = await subjRes.json();
  if (!Array.isArray(subjects)) {
    console.error('Error fetching subjects:', subjects);
    return;
  }

  const subjectMap = {};
  subjects.forEach(s => { subjectMap[s.name.trim()] = s.id; });

  let insertedCount = 0;

  // 3. Insert Questions
  for (const q of questionsData) {
    const subjectId = subjectMap[q.subject.trim()];
    if (!subjectId) continue;

    const optA = q.options.find(o => o.letter === 'A')?.text || null;
    const optB = q.options.find(o => o.letter === 'B')?.text || null;
    const optC = q.options.find(o => o.letter === 'C')?.text || null;
    const optD = q.options.find(o => o.letter === 'D')?.text || null;
    const correctOpt = q.options.find(o => o.is_correct === true)?.letter || null;

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: 'POST',
      headers: {
        'apikey': SECRET_KEY,
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        subject_id: subjectId,
        question_text: q.question_text,
        option_a: optA,
        option_b: optB,
        option_c: optC,
        option_d: optD,
        correct_option: correctOpt,
        explanation: q.explanation || null
      })
    });

    if (insertRes.ok) {
      insertedCount++;
    } else {
      const errText = await insertRes.text();
      console.error('Insert error:', errText);
    }
  }

  console.log(`✅ Finished importing! ${insertedCount} questions added.`);
}

seed();