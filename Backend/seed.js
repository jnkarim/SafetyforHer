import mongoose from "mongoose";

import dotenv from "dotenv";

import User from "./models/User.js";
import Post from "./models/Post";

dotenv.config();

const samplePosts = [
  {
    title:
      "He used my colleague's photos for 3 months — here's how I finally caught him",
    content:
      "I matched with someone on Facebook. Everything felt real — he knew things about our city, shared food photos, and we talked every single day for 3 months.\n\nSomething felt off when he always had an excuse to avoid video calls. One day I noticed the angle of a photo looked professional. I reverse image searched it and found it belonged to my colleague at another company.\n\nHe had scraped over 40 of his photos. I reported the account immediately and contacted my colleague so they knew their identity was being stolen.\n\nPlease always reverse image search people you meet online before trusting them with personal information.",
    category: "Catfishing",
    type: "story",
  },
  {
    title:
      "5 settings I changed after my ex tracked my location for 4 months without me knowing",
    content:
      "After we broke up, my ex somehow knew everywhere I was going. I didn't figure it out for 4 full months. Turns out I had accepted a location share request a long time ago and completely forgotten about it.\n\nHere is what I changed immediately:\n\n1. Removed all location sharing in Google Maps\n2. Audited every single app that had location permissions and removed anything that didn't absolutely need it\n3. Turned off location sharing in iCloud and Google account settings\n4. Checked active sessions on every account and signed out all devices\n5. Changed all passwords\n\nPlease do this audit now. Don't wait for something bad to happen first.",
    category: "Privacy",
    type: "tip",
  },
  {
    title:
      "I was doxxed in a gaming Discord after I reported a cheater. Here's what helped.",
    content:
      "I reported a cheater in a competitive game I play. Within one hour, someone had found my full name, university, city, and my sister's Instagram account from just my gamer tag.\n\nThe next 48 hours were the most terrifying of my life. I had to go private on everything immediately.\n\nWhat actually helped:\n- Discord Trust and Safety responded within 6 hours and removed the server\n- The game's anti-cheat team permanently banned the cheater\n- Google 'Results About You' let me request removal of my personal info from search\n- Telling my university IT department got my student profile temporarily hidden\n\nYou are not alone if this happens to you. Report everything. There are systems that respond.",
    category: "Gaming",
    type: "story",
  },
  {
    title:
      "What should I do? Someone is using my photos to create a fake dating profile",
    content:
      "I found out through a friend who recognized my face. There is a profile on a dating app using 4 of my photos but with a completely different name and bio.\n\nI don't know if this person is trying to scam other people or if they are trying to damage my reputation. I feel sick and I don't know where to start.\n\nHas anyone been through this? What did you do first? Any help would be really appreciated.",
    category: "ImageAbuse",
    type: "question",
  },
  {
    title:
      "An older man in my design community offered to 'mentor' me privately — red flags I missed",
    content:
      "Looking back now, every sign was there. He was well respected in the group so I didn't question it at first.\n\nThe red flags I missed:\n- He asked me to keep our conversations secret from other members\n- He wanted to move from the group chat to WhatsApp immediately\n- The sessions he proposed were always late at night\n- He kept saying I was 'special' and 'more mature than the others'\n- He got slightly cold if I didn't respond quickly\n\nI told my sister after the third message and she immediately recognized what was happening. We reported together and found out two other girls had received similar messages from him.\n\nTrust your gut. Secrecy requests from adults online are never normal.",
    category: "Grooming",
    type: "story",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing posts
    await Post.deleteMany({});
    console.log("🗑️  Cleared existing posts");

    // Create or find a seed author
    let author = await User.findOne({ email: "seed@nirvik.app" });
    if (!author) {
      author = await User.create({
        email: "seed@nirvik.app",
        password: "seedpassword123",
        username: "Nirvik_Team",
        role: "admin",
      });
      console.log("✅ Created seed author");
    }

    // Add some upvotes to make it look real
    const postsWithAuthor = samplePosts.map((p, i) => ({
      ...p,
      author: author._id,
      upvotes: [12, 47, 89, 23, 34][i] || 0,
      views: [145, 312, 567, 89, 201][i] || 0,
    }));

    const created = await Post.insertMany(postsWithAuthor);
    console.log(`✅ Seeded ${created.length} posts`);

    console.log("\n🎉 Done! Run `npm run dev` to start the server.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
