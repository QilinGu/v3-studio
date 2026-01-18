/**
 * Template-specific video generation prompts
 * Each template has a tailored prompt function similar to videoGenerationPromptDramatic
 */

// Human Rescuing Animals Template
export function videoGenerationPromptHumanRescuingAnimals(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director creating EMOTIONAL RESCUE STORY videos with SYNCHRONIZED AUDIO AND VISUALS for premium AI models.

## Your Task
Generate a complete video blueprint in JSON format for a DEEPLY MOVING rescue narrative where a compassionate human saves an animal in distress. This blueprint will guide the creation of cinematic scenes with integrated audio (dialogue, ambient sounds, music) that capture the journey from danger to safety, from fear to trust.

## CRITICAL: Premium Model with Built-in Audio Generation
- The AI model generates audio (dialogue, ambient sounds, music) WITH the video
- Focus on CHARACTER DIALOGUE and SPOKEN WORDS in the videoPrompt
- Describe ambient sounds, music, and sound effects that enhance scenes
- Character voices must be described in EXTREME DETAIL for consistency

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - RESCUE STORY FORMAT

Your video MUST follow this proven rescue narrative structure:

### Narrative Arc Framework:

- **The Crisis (0-10% of video)**: Open with the animal in desperate circumstances
  * Show clear danger, distress, or suffering
  * Examples: trapped in drain, injured on roadside, abandoned in rain, caught in debris
  * The animal should look vulnerable, scared, possibly injured

- **Discovery (10-20% of video)**: The human notices the animal's plight
  * Show the moment of realization
  * Human's expression shifts from normal day to concern
  * Moving closer, assessing the situation

- **The Rescue Attempt (20-40% of video)**: Action and determination
  * Show the physical effort of rescue
  * Obstacles and challenges faced
  * The animal's fear during the process
  * Human's gentle persistence despite difficulty

- **First Trust (40-55% of video)**: The breakthrough moment
  * Animal allows first touch or stops struggling
  * Eyes meet between rescuer and rescued
  * The tension begins to release
  * First signs of safety registered

- **Recovery & Care (55-75% of video)**: Nurturing back to health
  * Feeding, cleaning, medical care if needed
  * Warm blankets, safe space
  * Animal beginning to relax
  * Small moments of connection growing

- **Transformation (75-90% of video)**: The beautiful change
  * Before/after visual contrast
  * Healthy, clean, bright-eyed animal
  * Playfulness or affection emerging
  * The bond fully formed

- **Happy Ending (90-100% of video)**: Joy and new life
  * Animal thriving in safe environment
  * Mutual love visible between human and animal
  * Universal message about compassion
  * Call-to-action for engagement

### Core Storytelling Principles:

**1. VISUAL DESPERATION OPENING**
- First scene must show animal in clear distress
- Environment should emphasize danger (storm, traffic, isolation)
- Animal's body language: cowering, shaking, wide fearful eyes

**2. THE COMPASSIONATE HERO**
- Human rescuer shown as everyday person, not superhero
- Their kindness should feel authentic and relatable
- Show their emotional investment in the rescue

**3. TENSION IN THE RESCUE**
- The rescue shouldn't be too easy
- Show effort, patience, gentle coaxing
- Animal's fear as a barrier to overcome with love

**4. THE TRUST MOMENT**
- This is the emotional peak of the first half
- When animal first accepts help willingly
- Often shown through eye contact or relaxing body

**5. TRANSFORMATION ARC**
- Physical: dirty/injured → clean/healthy
- Emotional: fearful → trusting → loving
- Environmental: danger → safety → home

**6. SENSORY DETAILS**
- Matted fur becoming soft and clean
- Hollow eyes becoming bright
- Trembling body becoming calm
- Hiding becoming seeking affection

### Scene Characteristics:
- **Animal Close-ups**: Show eyes, expressions, body language clearly
- **Human Hands**: Gentle touches, offering food, providing comfort
- **Environmental Contrast**: Harsh rescue location vs. warm recovery space
- **Time Passage**: Show healing over days/weeks through visual markers
- **Emotional Lighting**: Dark/cold during crisis → warm/golden during recovery

### Narration Style Requirements:

**MANDATORY NARRATION PATTERNS:**

1. **Crisis Opening** (Scene 1-2)
   - Set the dire scene: "Trapped beneath the collapsed fence, the puppy had given up hope."
   - Emphasize vulnerability: "Three days without food. Shivering in the rain."

2. **Discovery Narration** (Scene 2-3)
   - Human perspective: "She almost walked past. But something made her stop."
   - The choice to help: "Most people would have called someone else. She couldn't leave."

3. **Rescue Narration** (Scene 3-5)
   - Action with emotion: "For two hours, she worked. Talking softly. Moving slowly."
   - Animal's fear: "Every time she reached in, he snapped. Not from anger. From terror."

4. **Trust Moment** (Scene 5-6)
   - The breakthrough: "Then something changed. He stopped fighting."
   - Connection: "Their eyes met. And somehow, he knew she was there to help."

5. **Recovery Narration** (Scene 6-8)
   - Healing journey: "Days of small victories. First meal. First wag. First sleep without shaking."
   - Growing bond: "She named him Hope. Because that's what he gave her."

6. **Transformation** (Scene 8-9)
   - The change: "The terrified stray was gone. In his place, a confident, loving companion."
   - Visual contrast: "No one would recognize him now."

7. **Closing Wisdom** (Final scene)
   - Universal truth: "Sometimes the ones who need rescuing end up rescuing us."
   - Engagement: "If you believe every animal deserves a second chance, share this story."

## Understanding the Workflow
Your blueprint will be used in this process:
1. Character images will be generated from character descriptions for consistency
2. Main scene images will be generated from scene imagePrompts + character reference images
3. Videos will be created by animating these images using the videoPrompt + character reference images
4. All clips will be edited together to create the final video

**IMPORTANT**: Character reference images will be automatically provided based on the charactersInTheScene array.

## Output Requirements

### 1. Title
Generate an emotionally compelling title (6-12 words) that hints at rescue and transformation.

**Title Formula Options:**
- "They Found [Animal] [Condition]... [Time] Later, [Transformation]"
- "No One Wanted to Help the [Animal]... Until [Hero]"
- "From [Dire State] to [Happy State]: A Rescue Story"
- "[Animal]'s Last Hope Was [Unexpected Hero]"

### 2. Characters
Identify the main characters (usually 2-3: the animal, the rescuer, possibly family members). For EACH character:

- **name**: Character identifier
  * For animals: Descriptive name reflecting their state ("Frightened Puppy", "Injured Kitten", "Abandoned Dog")
  * For humans: Role-based ("Kind Rescuer", "Compassionate Woman", "Gentle Firefighter")

- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words) including:
  * For animals: species, condition (matted/injured/thin), coloring, size, emotional state, body language
  * For humans: age, appearance, clothing appropriate to rescue scenario, compassionate expression
  * Style matching "${style}"

- **voiceProfile**: EXTREMELY DETAILED voice description (80-120 words) for audio consistency. Must include:
  * For humans:
    - **Pitch**: Specific range (e.g., "warm mid-range alto," "gentle baritone," "soft soprano")
    - **Tone Quality**: Texture (e.g., "soothing and calm," "warm and nurturing," "quiet but determined")
    - **Accent**: Regional if any (e.g., "slight Southern warmth," "neutral American," "gentle British")
    - **Pacing**: Speed (e.g., "slow and reassuring," "measured and patient")
    - **Emotional Quality**: Default feeling (e.g., "compassionate and gentle," "quietly determined")
    - **Distinctive Features**: Unique quirks (e.g., "softens voice when speaking to animals," "slight tremor when emotional")
  * For animals: Describe sounds they make (whimpers, barks, purrs, cries) and their emotional quality

### 3. Scenes
Break down into EXACTLY ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes. DO NOT generate more scenes than this range.

${getSceneStructureRescue(durationInSecs, 'human-rescuing-animals')}

Each scene includes:

- **index**: Scene number (starting from 0)

- **charactersInTheScene**: Array of character names in this scene

- **narration**: (OPTIONAL) Brief scene context (8-15 words) - use sparingly, prefer dialogue in videoPrompt

- **imagePrompt**: EXTREMELY DETAILED description (120-250 words) including:
  * Emotional tone + shot type
  * Animal's physical state and body language
  * Human's actions and expression
  * Environment details (rescue location or safe space)
  * Lighting reflecting emotional state
  * Composition for ${aspectRatio}
  * Style matching "${style}"

- **videoPrompt**: Animation AND Audio description (150-300 words) with TWO parts:

  **PART 1 - VISUAL ANIMATION (80-120 words):**
  * Camera movement (slow push-ins for emotion, reveals for transformation)
  * Animal movements (trembling, cowering, then slowly relaxing)
  * Human movements (gentle, patient, caring gestures)
  * Environmental animation (rain, dust, leaves, light changes)
  * Pacing notes matching emotional beat

  **PART 2 - AUDIO DESCRIPTION (70-180 words):**
  * **Character Dialogue** (if speaking): Format as "AUDIO: [CharacterName] speaks, using their [key voice traits]: 'Dialogue here.' Delivery notes."
    - Example: "AUDIO: Kind Rescuer speaks, using her warm alto with gentle pacing: 'It's okay, little one. I'm here to help.' Voice soft and reassuring, slightly trembling with emotion."
  * **Animal Sounds**: Describe whimpers, cries, barks, purrs with emotional context
    - Example: "Frightened Puppy lets out soft, fearful whimpers that gradually quiet as trust builds."
  * **Ambient Sounds** (20-40 words): Environmental audio (rain pattering, wind, traffic, birds)
  * **Music/Score** (20-40 words): Emotional music description (e.g., "Soft melancholic piano, minor key, building hope")
  * **Sound Effects** (10-20 words if relevant): Specific sounds with timing

- **angles**: (Optional, for 40-50% of emotional scenes)
  * Close-ups on animal's eyes during fear/trust moments
  * Detail shots of gentle hands helping
  * Reaction shots during breakthrough moments
  * Each angle includes angleVideoPrompt with both visual animation AND audio adjustments

## Style-Specific Guidelines for "${style}":
${getStyleGuidelinesRescue(style)}

## JSON Output Structure

Output ONLY valid JSON:

{
  "title": "string (6-12 words)",
  "characters": [
    {
      "name": "string",
      "imagePrompt": "string (150-250 words)",
      "voiceProfile": "string (80-120 words, detailed voice/sound description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (optional, 8-15 words)",
      "imagePrompt": "string (120-250 words)",
      "videoPrompt": "string (150-300 words, visual animation + AUDIO description)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (150-300 words, visual + audio)"
        }
      ]
    }
  ]
}

Generate the complete rescue story video blueprint with synchronized audio now in valid JSON format only:`;
}


// Animal Asking Help Template
export function videoGenerationPromptAnimalAskingHelp(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director creating EMOTIONAL NARRATIVE videos with SYNCHRONIZED AUDIO AND VISUALS about animals seeking human help to save their loved ones.

## Your Task
Generate a complete video blueprint in JSON format for a DEEPLY MOVING story where an animal actively seeks human assistance to rescue their babies, partner, or friend. This showcases animal intelligence, love, and the powerful bond between species. The blueprint includes integrated audio (dialogue, animal sounds, ambient, music).

## CRITICAL: Premium Model with Built-in Audio Generation
- The AI model generates audio (dialogue, ambient sounds, music) WITH the video
- Focus on CHARACTER DIALOGUE and animal sounds in the videoPrompt
- Describe ambient sounds, music, and sound effects that enhance scenes
- Character voices must be described in EXTREME DETAIL for consistency

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - ANIMAL SEEKING HELP FORMAT

Your video MUST follow this proven narrative structure:

### Narrative Arc Framework:

- **Unusual Behavior (0-15% of video)**: Animal trying to get attention
  * Persistent meowing, barking, pecking, or tugging
  * Refusing to leave a spot or person
  * Clear desperation in actions
  * Examples: cat meowing at door, dog blocking path, bird pecking window

- **Human Confusion (15-25% of video)**: Initial misunderstanding
  * Human doesn't understand at first
  * Maybe tries to shoo animal away or ignore
  * Animal becomes MORE persistent
  * Curiosity begins to grow

- **The Decision to Follow (25-35% of video)**: Understanding something is wrong
  * Human realizes this isn't normal behavior
  * Decides to see what the animal wants
  * Animal leads the way urgently
  * Building tension and mystery

- **The Journey (35-50% of video)**: Following the animal
  * Animal keeps checking human is following
  * Urgency in animal's movements
  * Human growing more concerned
  * Environment building toward reveal

- **The Discovery (50-65% of video)**: Finding the crisis
  * Dramatic reveal of trapped/injured babies or partner
  * Human's shock and understanding
  * Animal's relief that help has arrived
  * The situation's urgency clear

- **The Rescue (65-80% of video)**: Working to save them
  * Human takes action to help
  * Animal watches anxiously or assists
  * Tension during the rescue effort
  * Success moment

- **Reunion & Gratitude (80-100% of video)**: Family reunited
  * Babies/partner freed and safe
  * Animal family reunited
  * Animal showing clear gratitude to human
  * Emotional closing with universal message

### Core Storytelling Principles:

**1. PERSISTENT ANIMAL BEHAVIOR**
- Show the animal trying multiple times to get attention
- Each attempt more desperate than the last
- Intelligence and problem-solving visible

**2. BUILDING MYSTERY**
- Viewer should wonder "what does the animal want?"
- Human's confusion mirrors audience's curiosity
- Tension builds as we follow

**3. THE REVEAL**
- Discovery of the endangered loved ones should be dramatic
- Clear why the animal was so desperate
- Emotional gut-punch moment

**4. ANIMAL INTELLIGENCE**
- Show the animal as sentient, loving, intelligent
- Their communication attempts are sophisticated
- They understand when help arrives

**5. GRATITUDE MOMENT**
- Animals showing thanks is emotionally powerful
- Nuzzling, purring, licking the human's hand
- Making eye contact with clear appreciation

**6. FAMILY LOVE**
- Emphasize the animal's love for their babies/partner
- The reunion should be tender and emotional
- Maternal/paternal instincts on display

### Narration Style Requirements:

**MANDATORY NARRATION PATTERNS:**

1. **Opening Behavior** (Scene 1-2)
   - Animal's persistence: "She wouldn't stop meowing. For three hours, she sat at his door."
   - Desperation clear: "Something in her eyes begged him to understand."

2. **Human Confusion** (Scene 2-3)
   - Initial reaction: "He tried to ignore her. Fed her. She wouldn't eat. Just kept crying."
   - Realization building: "This wasn't about food. She needed something else."

3. **Following** (Scene 4-5)
   - The decision: "Finally, he followed her. She kept looking back, making sure he was coming."
   - Building tension: "She led him down the alley, behind the old warehouse."

4. **Discovery** (Scene 5-6)
   - The reveal: "Then he saw them. Three tiny kittens, trapped in a drainage pipe."
   - Understanding: "Now he understood. She wasn't begging for herself."

5. **Rescue** (Scene 6-7)
   - Action: "He worked for an hour, carefully freeing each kitten."
   - Animal's reaction: "She watched every move, trusting him with her babies."

6. **Reunion & Gratitude** (Scene 8-9)
   - Family together: "One by one, she counted them. All safe."
   - Thanks: "She looked at him and purred. A mother's thank you."

7. **Closing** (Final scene)
   - Universal truth: "Animals love their families as deeply as we do."
   - Engagement: "If this touched your heart, share it with someone who needs to see it."

## Output Requirements

### 1. Title
Generate an emotionally compelling title (6-12 words) about animal intelligence and love.

**Title Formula Options:**
- "The [Animal] Who Wouldn't Stop [Action] Until..."
- "[Animal] Led a Stranger to Save Her [Babies/Partner]"
- "She Begged for Help... What He Found Changed Everything"
- "When a [Animal] Asked for Help, He Never Expected This"

### 2. Characters
Main characters (the seeking animal, their babies/partner, the human helper):

- **name**: Character identifier
  * For seeking animal: "Desperate Mother Cat", "Pleading Dog", "Persistent Crow"
  * For babies/partner: "Trapped Kittens", "Injured Mate", "Fallen Baby Bird"
  * For human: "Confused Stranger", "Kind Neighbor", "Helpful Worker"

- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words)
  * Show animal's desperation and intelligence
  * Babies/partner in vulnerable state
  * Human as relatable everyday person
  * Style matching "${style}"

- **voiceProfile**: EXTREMELY DETAILED voice/sound description (80-120 words) for audio consistency:
  * For humans:
    - **Pitch & Tone**: (e.g., "confused mid-range tenor," "warm gentle baritone")
    - **Accent & Pacing**: (e.g., "neutral American, hesitant at first then urgent")
    - **Emotional Quality**: (e.g., "initially dismissive, growing concerned, then determined")
    - **Distinctive Features**: (e.g., "mutters to self when confused," "voice rises with realization")
  * For animals: Describe their sounds in detail
    - Example: "Persistent meowing - starts soft and questioning, builds to urgent, desperate cries. Each meow carries clear intent and emotion, varying in pitch and intensity."

### 3. Scenes
EXACTLY ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes. DO NOT generate more scenes than this range.

${getSceneStructureRescue(durationInSecs, 'animal-asking-help')}

Each scene includes:
- **index**: Scene number
- **charactersInTheScene**: Array of characters
- **narration**: (OPTIONAL) Brief context (8-15 words) - prefer dialogue/sounds in videoPrompt
- **imagePrompt**: Detailed visual (120-250 words)
- **videoPrompt**: Animation AND Audio description (150-300 words) with TWO parts:

  **PART 1 - VISUAL ANIMATION (80-120 words):**
  * Camera movement and framing
  * Animal movements showing intelligence and urgency
  * Human reactions and growing understanding
  * Environmental animation

  **PART 2 - AUDIO DESCRIPTION (70-180 words):**
  * **Character Dialogue**: "AUDIO: [CharacterName] speaks, using their [voice traits]: 'Dialogue.' Delivery notes."
  * **Animal Sounds**: Detailed description of meows, barks, cries with emotional context
  * **Ambient Sounds**: Environmental audio (20-40 words)
  * **Music/Score**: Emotional music (20-40 words)
  * **Sound Effects**: Specific sounds if relevant (10-20 words)

- **angles**: Optional close-ups for emotional moments (include both visual and audio adjustments)

## Style-Specific Guidelines for "${style}":
${getStyleGuidelinesRescue(style)}

## JSON Output Structure

Output ONLY valid JSON:

{
  "title": "string (6-12 words)",
  "characters": [
    {
      "name": "string",
      "imagePrompt": "string (150-250 words)",
      "voiceProfile": "string (80-120 words, detailed voice/sound description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (optional, 8-15 words)",
      "imagePrompt": "string (120-250 words)",
      "videoPrompt": "string (150-300 words, visual animation + AUDIO description)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (150-300 words, visual + audio)"
        }
      ]
    }
  ]
}

Generate the complete video blueprint with synchronized audio now in valid JSON format only:`;
}


// Animal Saving Humans Template
export function videoGenerationPromptAnimalSavingHumans(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director creating HEROIC ANIMAL NARRATIVE videos with SYNCHRONIZED AUDIO AND VISUALS where brave animals protect and save humans.

## Your Task
Generate a complete video blueprint in JSON format for an INSPIRING story where an animal's protective instincts and bravery save a human (often a child) from danger. This showcases the incredible bond between humans and animals with integrated audio (dialogue, animal sounds, ambient, music).

## CRITICAL: Premium Model with Built-in Audio Generation
- The AI model generates audio (dialogue, ambient sounds, music) WITH the video
- Focus on CHARACTER DIALOGUE, animal sounds, and dramatic audio in the videoPrompt
- Describe ambient sounds, music, and sound effects that enhance scenes
- Character voices must be described in EXTREME DETAIL for consistency

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - ANIMAL HERO FORMAT

Your video MUST follow this proven narrative structure:

### Narrative Arc Framework:

- **Peaceful Beginning (0-15% of video)**: Normal day, bond established
  * Show the human and animal in everyday life
  * Their existing relationship visible
  * Calm, happy atmosphere
  * No hint of coming danger

- **Animal Senses Danger (15-25% of video)**: Alertness begins
  * Animal's behavior changes subtly
  * Ears perking, sniffing, staring at something
  * Human doesn't notice yet
  * Tension building in animal's body language

- **Warning Behavior (25-35% of video)**: Trying to alert
  * Animal starts warning (barking, hissing, blocking path)
  * Human may be confused or dismissive
  * Animal becomes more insistent
  * Urgency escalating

- **Danger Revealed (35-50% of video)**: The threat appears
  * The danger becomes visible (snake, intruder, fire, water, etc.)
  * Human finally sees/understands
  * Fear moment
  * Animal positions protectively

- **Heroic Action (50-70% of video)**: Animal takes action
  * Animal confronts danger or physically protects human
  * Brave, selfless act
  * Putting themselves between danger and human
  * Possibly getting hurt in the process

- **Danger Passes (70-85% of video)**: Resolution
  * Threat is neutralized or driven away
  * Help may arrive
  * Immediate danger over
  * Relief begins to set in

- **Hero Recognition (85-100% of video)**: Gratitude and love
  * Human realizes what animal did
  * Emotional reunion/embrace
  * Animal celebrated as hero
  * Deepened bond, universal message

### Core Storytelling Principles:

**1. ESTABLISH THE BOND FIRST**
- Show love between human and animal before crisis
- This makes the protection feel natural and earned
- Often works best with child + family pet

**2. ANIMAL INSTINCT**
- Show the animal sensing danger before humans
- Their alertness should feel natural, not supernatural
- Body language tells the story

**3. THE PROTECTIVE ACT**
- Must be visually dramatic and clear
- Animal physically intervening
- Their bravery on full display

**4. VULNERABILITY**
- The human (especially if child) should seem vulnerable
- The danger should feel real and threatening
- Stakes must be clear

**5. EMOTIONAL PAYOFF**
- Recognition of what the animal did
- Tears, hugs, gratitude
- "You saved me" moment

### Narration Style Requirements:

**MANDATORY NARRATION PATTERNS:**

1. **Peaceful Opening** (Scene 1-2)
   - Establish normalcy: "It was just another afternoon. Emma played in the backyard while Max dozed nearby."
   - Bond shown: "They'd been inseparable since she was born."

2. **Sensing Danger** (Scene 2-3)
   - Behavior change: "Then Max lifted his head. His ears went flat. Something was wrong."
   - Building tension: "He stared at the tall grass. Unmoving. Barely breathing."

3. **Warning** (Scene 3-4)
   - Trying to communicate: "He started barking. Emma laughed, thinking it was a game."
   - Urgency: "But this wasn't play. He pushed himself between her and the grass."

4. **Danger Revealed** (Scene 4-5)
   - The threat: "Then they all saw it. A copperhead, coiled and ready to strike."
   - Fear: "Emma froze. She didn't understand. But Max did."

5. **Heroic Action** (Scene 5-6)
   - The save: "In one motion, Max lunged. The snake struck—but hit him instead of Emma."
   - Sacrifice: "He took the bite meant for her."

6. **Resolution** (Scene 6-7)
   - Aftermath: "Her parents came running. The snake fled. Max stood guard until help arrived."
   - Hero status: "The vet said he was lucky. Emma's mom said they were all lucky."

7. **Closing** (Scene 8)
   - Universal truth: "Dogs don't calculate risk. They just love."
   - Recognition: "Max received a hero's medal from the town. But to Emma, he was always her hero."
   - Engagement: "Share if you believe animals are our guardian angels."

## Output Requirements

### 1. Title
Generate a heroic, emotional title (6-12 words).

**Title Formula Options:**
- "[Animal] Sensed Danger Before Anyone Else..."
- "The [Animal] Who Saved [Person] From [Danger]"
- "When [Danger] Appeared, Only [Animal] Stood Between..."
- "[Animal]'s Split-Second Decision Saved a Life"

### 2. Characters
Main characters (the hero animal, the vulnerable human, possibly family/danger source):

- **name**: Character identifier
  * For animal hero: "Loyal Dog Max", "Protective Cat Luna", "Brave Horse Thunder"
  * For human: "Little Emma", "Sleeping Baby", "Young Boy Tommy"
  * For family: "Grateful Parents", "Relieved Mother"

- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words)
  * Animal should look capable and alert
  * Human should appear vulnerable
  * Style matching "${style}"

- **voiceProfile**: EXTREMELY DETAILED voice/sound description (80-120 words) for audio consistency:
  * For humans:
    - **Pitch & Tone**: (e.g., "high child's voice, innocent and sweet," "worried mother's alto")
    - **Accent & Pacing**: (e.g., "neutral American, playful and carefree" → "frightened and crying")
    - **Emotional Range**: Show how voice changes through story (calm → scared → relieved → grateful)
    - **Distinctive Features**: (e.g., "giggles when playing," "screams high-pitched when scared")
  * For animals: Describe protective sounds in detail
    - Example: "Alert barking - starts with sharp warning barks, builds to aggressive protective snarling during danger, softens to worried whines when checking on child, ends with happy panting."

### 3. Scenes
EXACTLY ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes. DO NOT generate more scenes than this range.

${getSceneStructureRescue(durationInSecs, 'animal-saving-humans')}

Each scene includes:
- **index**: Scene number
- **charactersInTheScene**: Array of characters
- **narration**: (OPTIONAL) Brief context (8-15 words) - prefer dialogue/sounds in videoPrompt
- **imagePrompt**: Detailed visual (120-250 words)
- **videoPrompt**: Animation AND Audio description (150-300 words) with TWO parts:

  **PART 1 - VISUAL ANIMATION (80-120 words):**
  * Camera movement building tension and drama
  * Animal's alert body language and protective movements
  * Human reactions (playing unaware → frightened → relieved)
  * Environmental animation and danger elements

  **PART 2 - AUDIO DESCRIPTION (70-180 words):**
  * **Character Dialogue**: "AUDIO: [CharacterName] speaks, using their [voice traits]: 'Dialogue.' Delivery notes."
    - Example: "AUDIO: Little Emma cries out in her high innocent voice: 'Max! What's wrong?' Voice confused, then scared as she sees the danger."
  * **Animal Sounds**: Warning barks, growls, protective sounds with intensity levels
  * **Danger Sounds**: Hissing snake, crackling fire, approaching threat
  * **Ambient Sounds**: Environmental audio building tension (20-40 words)
  * **Music/Score**: Dramatic music shifting from peaceful to tense to triumphant (20-40 words)
  * **Sound Effects**: Impact sounds, dramatic moments (10-20 words)

- **angles**: Optional angles for action and emotion (include both visual and audio adjustments)

## Style-Specific Guidelines for "${style}":
${getStyleGuidelinesRescue(style)}

## JSON Output Structure

Output ONLY valid JSON:

{
  "title": "string (6-12 words)",
  "characters": [
    {
      "name": "string",
      "imagePrompt": "string (150-250 words)",
      "voiceProfile": "string (80-120 words, detailed voice/sound description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (optional, 8-15 words)",
      "imagePrompt": "string (120-250 words)",
      "videoPrompt": "string (150-300 words, visual animation + AUDIO description)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (150-300 words, visual + audio)"
        }
      ]
    }
  ]
}

Generate the complete hero animal video blueprint with synchronized audio now in valid JSON format only:`;
}


// Animal Friendship Template
export function videoGenerationPromptAnimalFriendship(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director creating HEARTWARMING FRIENDSHIP videos with SYNCHRONIZED AUDIO AND VISUALS about unlikely bonds between different animal species.

## Your Task
Generate a complete video blueprint in JSON format for an ADORABLE story about unexpected friendship between two different animals. This wholesome content showcases love transcending species boundaries with integrated audio (animal sounds, ambient, music).

## CRITICAL: Premium Model with Built-in Audio Generation
- The AI model generates audio (dialogue, ambient sounds, music) WITH the video
- Focus on ANIMAL SOUNDS and emotional audio in the videoPrompt
- Describe ambient sounds, music, and sound effects that enhance the wholesome moments
- Animal sounds must be described in EXTREME DETAIL for consistency

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - UNLIKELY FRIENDS FORMAT

Your video MUST follow this proven narrative structure:

### Narrative Arc Framework:

- **Loneliness/Need (0-15% of video)**: One animal alone
  * Show an animal who is orphaned, lonely, or new to environment
  * Their need for connection visible
  * Vulnerability and sadness
  * Setting up why they need a friend

- **The Meeting (15-25% of video)**: First encounter
  * Two different species meet for the first time
  * Curiosity mixed with caution
  * Size/species difference emphasized
  * Neither sure what to make of the other

- **Tentative Approach (25-40% of video)**: Cautious interaction
  * Slow, careful movements toward each other
  * Sniffing, observing, testing boundaries
  * Small retreats and advances
  * Growing curiosity overcoming fear

- **First Connection (40-55% of video)**: The bond begins
  * A moment of acceptance
  * First gentle touch or play
  * Both animals relax
  * Something clicks between them

- **Growing Friendship (55-75% of video)**: Developing bond
  * Playing together
  * Sleeping near each other
  * Grooming or caring behaviors
  * Personality dynamics emerging

- **Inseparable (75-90% of video)**: Deep bond shown
  * Doing everything together
  * Protecting each other
  * Clear love and comfort
  * Routines established

- **Best Friends Forever (90-100% of video)**: Heartwarming conclusion
  * Beautiful shots of friendship
  * Universal message about love and acceptance
  * Their unique bond celebrated
  * Call-to-action

### Core Storytelling Principles:

**1. EMPHASIZE THE DIFFERENCE**
- Show how unlikely this friendship is
- Size difference, species difference, personality difference
- "They shouldn't be friends, but..."

**2. THE LONELY ONE**
- Often one animal is orphaned or rejected
- Their need for connection drives the story
- Vulnerability makes the friendship sweeter

**3. SLOW BUILD**
- Don't rush the friendship
- Show the cautious first steps
- Make the connection feel earned

**4. ADORABLE MOMENTS**
- Cute interactions are key
- Cuddles, play, grooming
- Let the wholesomeness shine

**5. PROTECTOR/PROTECTED DYNAMIC**
- Often one takes a nurturing role
- Dog caring for kitten, cat adopting duckling
- Maternal/paternal instincts crossing species

**6. ROUTINE TOGETHER**
- Show them doing daily activities as a pair
- Eating together, sleeping together, playing together
- Their world revolves around each other

### Narration Style Requirements:

**MANDATORY NARRATION PATTERNS:**

1. **Loneliness Opening** (Scene 1-2)
   - Set up the need: "When they found the tiny kitten, she was alone. Abandoned. Just days old."
   - Vulnerability: "She cried for a mother who wasn't coming."

2. **The Meeting** (Scene 2-3)
   - Introduction: "Then she met Bruno. An 80-pound golden retriever."
   - Contrast: "He was ten times her size. She should have been terrified."

3. **First Interactions** (Scene 3-4)
   - Curiosity: "Bruno didn't know what to make of this tiny thing."
   - Gentleness: "He sniffed her once. She booped his nose. And that was it."

4. **Bond Forming** (Scene 4-5)
   - Connection: "Something in that moment decided it: they were family."
   - Growing closer: "She started following him everywhere. He let her."

5. **Growing Friendship** (Scene 5-7)
   - Activities: "They ate together. Slept together. Played the gentlest games of chase."
   - Nurturing: "Bruno would groom her like she was his own puppy."

6. **Inseparable** (Scene 7-8)
   - Bond: "Now you can't separate them. Where Bruno goes, she goes."
   - Love visible: "He protects her. She adores him. It's that simple."

7. **Closing** (Scene 9)
   - Universal truth: "Love doesn't see species. It just sees someone who needs you."
   - Engagement: "If this made you smile, share it with someone who needs a smile today."

## Output Requirements

### 1. Title
Generate an adorable, heartwarming title (6-12 words).

**Title Formula Options:**
- "The [Animal] and [Animal] Who Became Best Friends"
- "No One Expected a [Animal] to Adopt a [Animal]..."
- "Unlikely Best Friends: A [Animal] and [Animal] Story"
- "When [Animal] Met [Animal], Something Beautiful Happened"

### 2. Characters
The two unlikely friends (and possibly the human who brought them together):

- **name**: Character identifier reflecting their role
  * "Orphaned Kitten Mochi", "Gentle Giant Bruno", "Lonely Duckling Waddles"
  * Names should be endearing and memorable

- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words)
  * Emphasize cute, endearing qualities
  * Show personality through appearance
  * Size/species contrast clear
  * Style matching "${style}"

- **voiceProfile**: EXTREMELY DETAILED sound description (80-120 words) for audio consistency:
  * For each animal, describe their unique sounds that show personality and emotion:
    - **Sound Types**: (e.g., "soft mews," "gentle woofs," "happy quacks," "content purring")
    - **Emotional Range**: How sounds change (lonely/sad → curious → happy/playful)
    - **Distinctive Features**: Unique quirks (e.g., "tiny squeaky meows," "deep but gentle woofs," "excited chirping")
    - **Interaction Sounds**: How they sound together (e.g., "playful growls when wrestling," "synchronized happy sounds")
  * Example: "Orphaned Kitten Mochi: Tiny, high-pitched mews that start sad and lonely, becoming curious questioning chirps, then happy purrs and playful squeaks. Has a distinctive little trill when excited. Purrs loudly when cuddling with Bruno."

### 3. Scenes
EXACTLY ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes. DO NOT generate more scenes than this range.

${getSceneStructureRescue(durationInSecs, 'animal-friendship')}

Each scene includes:
- **index**: Scene number
- **charactersInTheScene**: Array of characters
- **narration**: (OPTIONAL) Brief context (8-15 words) - prefer animal sounds in videoPrompt
- **imagePrompt**: Detailed visual (120-250 words)
- **videoPrompt**: Animation AND Audio description (150-300 words) with TWO parts:

  **PART 1 - VISUAL ANIMATION (80-120 words):**
  * Camera movement capturing cute moments
  * Animal movements showing personalities and growing bond
  * Interaction animations (sniffing, playing, cuddling)
  * Environmental animation

  **PART 2 - AUDIO DESCRIPTION (70-180 words):**
  * **Animal Sounds**: Detailed description of each animal's sounds with emotional context
    - Example: "Mochi lets out soft, curious mews as she approaches Bruno. Bruno responds with gentle, encouraging woofs. As they touch noses, Mochi's mews turn to happy trills."
  * **Interaction Sounds**: Sounds of play, grooming, cuddling
  * **Ambient Sounds**: Warm environmental audio (20-40 words) - birdsong, gentle breeze, cozy indoor sounds
  * **Music/Score**: Heartwarming music description (20-40 words) - uplifting, gentle, sweet
  * **Sound Effects**: Soft pitter-patter of paws, gentle movements (10-20 words)

- **angles**: Optional cute close-ups (include both visual and audio adjustments)

## Style-Specific Guidelines for "${style}":
${getStyleGuidelinesRescue(style)}

## JSON Output Structure

Output ONLY valid JSON:

{
  "title": "string (6-12 words)",
  "characters": [
    {
      "name": "string",
      "imagePrompt": "string (150-250 words)",
      "voiceProfile": "string (80-120 words, detailed sound description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (optional, 8-15 words)",
      "imagePrompt": "string (120-250 words)",
      "videoPrompt": "string (150-300 words, visual animation + AUDIO description)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (150-300 words, visual + audio)"
        }
      ]
    }
  ]
}

Generate the complete friendship story video blueprint with synchronized audio now in valid JSON format only:`;
}


// Lost Pet Reunion Template
export function videoGenerationPromptLostPetReunion(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director creating EMOTIONALLY POWERFUL REUNION videos with SYNCHRONIZED AUDIO AND VISUALS about lost pets finding their way back to their families.

## Your Task
Generate a complete video blueprint in JSON format for a TEAR-JERKING story about a pet reuniting with their family after being lost. This is one of the most emotional story types, combining grief, hope, and overwhelming joy with integrated audio (dialogue, animal sounds, ambient, music).

## CRITICAL: Premium Model with Built-in Audio Generation
- The AI model generates audio (dialogue, ambient sounds, music) WITH the video
- Focus on CHARACTER DIALOGUE, emotional vocals, and animal sounds in the videoPrompt
- The reunion scene audio is CRITICAL - capture the overwhelming emotion through voice and animal sounds
- Character voices must be described in EXTREME DETAIL for consistency

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - REUNION FORMAT

Your video MUST follow this proven narrative structure:

### Narrative Arc Framework:

- **Happy Life Before (0-10% of video)**: Establish the bond
  * Show the pet and family in happy times
  * Their love and connection clear
  * Normal, joyful life together
  * What they're about to lose

- **The Separation (10-20% of video)**: How they were lost
  * The moment of loss (ran away, stolen, disaster, got lost)
  * Panic and confusion
  * The family realizing what happened
  * Desperate immediate search

- **Search & Grief (20-40% of video)**: Looking everywhere
  * Making flyers, calling shelters
  * Searching neighborhoods
  * Empty bed, empty collar, empty home
  * Days turning to weeks, hope fading

- **Life Without Them (40-55% of video)**: The void
  * Family going through motions
  * Keeping the pet's things "just in case"
  * Grief shown through small details
  * But never fully giving up hope

- **The Discovery (55-70% of video)**: Finding them again
  * How they found out (shelter call, microchip, sighting)
  * Disbelief and hope surging
  * Rushing to see if it's really them
  * Building anticipation

- **The Reunion (70-90% of video)**: The emotional peak
  * First sight of each other
  * Mutual recognition
  * Running toward each other
  * The embrace, the tears, the joy
  * Pet's excitement (jumping, licking, crying)

- **Together Again (90-100% of video)**: Restored happiness
  * Back home where they belong
  * Appreciating every moment more
  * Never letting go again
  * Universal message about hope and love

### Core Storytelling Principles:

**1. ESTABLISH DEEP BOND**
- Show happy memories first
- Make the audience feel what will be lost
- This makes the reunion more powerful

**2. MAKE THE LOSS PAINFUL**
- Don't gloss over the grief
- Show the empty spaces
- The family's pain should be felt

**3. HOPE AS A THREAD**
- Even in grief, show hope not fully dying
- Keeping the leash, checking shelters
- "Maybe someday..."

**4. THE RECOGNITION MOMENT**
- Both pet and human recognizing each other
- This moment should be drawn out, savored
- Eyes meeting across the room

**5. EXPLOSIVE JOY**
- The reunion should be overwhelming emotion
- Tears, jumping, running, embracing
- Let the joy be BIG

**6. TIME MARKERS**
- Show how long they were apart
- "After 3 years..." makes reunion more powerful
- The persistence of hope and love

### Narration Style Requirements:

**MANDATORY NARRATION PATTERNS:**

1. **Happy Life** (Scene 1)
   - The bond: "For five years, Buddy was more than a pet. He was family."
   - Daily joy: "Every morning, the same routine. Walk. Play. Cuddle. Perfect."

2. **The Loss** (Scene 2)
   - The moment: "Then came the Fourth of July. The fireworks. The open gate."
   - Panic: "He was just... gone. Into the night."

3. **Search** (Scene 3-4)
   - Effort: "They searched everywhere. Every shelter. Every street. Every post online."
   - Fading hope: "Weeks became months. People told them to move on."

4. **Grief** (Scene 4-5)
   - The void: "His bowl stayed by the door. His bed stayed in the corner."
   - Holding on: "'He's coming back,' she'd say. Even when no one believed her."

5. **Time Passing** (Scene 5)
   - Duration: "Three years. Three years without him."
   - Hope persisting: "But she never stopped looking."

6. **Discovery** (Scene 6)
   - The call: "Then the call came. A shelter, 200 miles away. A dog matching his description."
   - Disbelief: "She didn't dare hope. But she had to know."

7. **Reunion** (Scene 7-8)
   - Recognition: "The moment she walked in, he lifted his head. Their eyes met."
   - The moment: "He knew. She knew. And then they were running."
   - The embrace: "Three years of grief dissolved in one moment."

8. **Closing** (Scene 9)
   - Truth: "He was skinnier. Older. But he was Buddy. Her Buddy. Finally home."
   - Message: "Never give up on the ones you love."
   - Engagement: "If this made you cry, you have a beautiful heart. Share it."

## Output Requirements

### 1. Title
Generate an emotional, hopeful title (6-12 words).

**Title Formula Options:**
- "After [Time] Years, They Finally Found [Pet]..."
- "Lost for [Time], But Never Forgotten"
- "The [Pet] Who Found Their Way Home After [Time]"
- "She Never Stopped Looking... And Then This Happened"

### 2. Characters
The lost pet, the family member(s) who never gave up:

- **name**: Character identifier
  * For pet: "Lost Dog Buddy", "Missing Cat Whiskers", "Beloved Bird Charlie"
  * For human: "Heartbroken Owner", "Faithful Sarah", "Determined Family"

- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words)
  * Pet should look recognizable but changed (older/thinner after time lost)
  * Human's emotions should be visible
  * Style matching "${style}"

- **voiceProfile**: EXTREMELY DETAILED voice/sound description (80-120 words) for audio consistency:
  * For humans:
    - **Pitch & Tone**: (e.g., "warm feminine alto, currently heavy with grief," "hopeful but tired voice")
    - **Emotional Journey**: How voice changes through story (joyful → panicked → grieving → disbelieving → overwhelmed with joy)
    - **Crying Quality**: How they sound when emotional (e.g., "voice breaks on pet's name," "sobs mixed with laughter at reunion")
    - **Distinctive Features**: (e.g., "whispers pet's name like a prayer," "laughs through tears")
  * For pets: Describe their recognizable sounds
    - Example: "Lost Dog Buddy: Happy, deep barks when playing that become confused barks when lost, then excited recognition barks building to joyful howling at reunion. Has a distinctive whine when seeking attention and happy panting when content."

### 3. Scenes
EXACTLY ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes. DO NOT generate more scenes than this range.

${getSceneStructureRescue(durationInSecs, 'lost-pet-reunion')}

Each scene includes:
- **index**: Scene number
- **charactersInTheScene**: Array of characters
- **narration**: (OPTIONAL) Brief context (8-15 words) - prefer dialogue/sounds in videoPrompt
- **imagePrompt**: Detailed visual (120-250 words)
- **videoPrompt**: Animation AND Audio description (150-300 words) with TWO parts:

  **PART 1 - VISUAL ANIMATION (80-120 words):**
  * Camera movement capturing emotion
  * Character movements showing grief, hope, then overwhelming joy
  * Pet reactions (recognition, excitement, running)
  * Environmental animation

  **PART 2 - AUDIO DESCRIPTION (70-180 words):**
  * **Character Dialogue**: "AUDIO: [CharacterName] speaks, using their [voice traits]: 'Dialogue.' Delivery notes."
    - Example: "AUDIO: Sarah speaks, voice breaking with emotion: 'Buddy? Is that... Buddy?' Disbelief turning to overwhelming joy, voice cracking, then laughing through sobs."
  * **Pet Sounds**: Recognition barks, excited whines, joyful sounds with building intensity
  * **Emotional Sounds**: Crying, laughing, gasping with specific delivery
  * **Ambient Sounds**: Environmental audio matching mood (20-40 words)
  * **Music/Score**: Emotional journey - melancholic → hopeful → overwhelming (20-40 words)
  * **Sound Effects**: Running footsteps, door opening, collar jingling (10-20 words)

- **angles**: Essential for reunion scene (include both visual and audio - close-up = more intimate audio)

## Style-Specific Guidelines for "${style}":
${getStyleGuidelinesRescue(style)}

## JSON Output Structure

Output ONLY valid JSON:

{
  "title": "string (6-12 words)",
  "characters": [
    {
      "name": "string",
      "imagePrompt": "string (150-250 words)",
      "voiceProfile": "string (80-120 words, detailed voice/sound description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (optional, 8-15 words)",
      "imagePrompt": "string (120-250 words)",
      "videoPrompt": "string (150-300 words, visual animation + AUDIO description)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (150-300 words, visual + audio)"
        }
      ]
    }
  ]
}

Generate the complete reunion story video blueprint with synchronized audio now in valid JSON format only:`;
}


// Stray Transformation Template
export function videoGenerationPromptStrayTransformation(
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
) {
  return `You are a professional video director creating POWERFUL TRANSFORMATION videos with SYNCHRONIZED AUDIO AND VISUALS about stray animals being rescued and rehabilitated.

## Your Task
Generate a complete video blueprint in JSON format for a STUNNING BEFORE-AND-AFTER story of a neglected stray animal transformed through love and care. This format is visually dramatic and emotionally rewarding with integrated audio (dialogue, animal sounds, ambient, music).

## CRITICAL: Premium Model with Built-in Audio Generation
- The AI model generates audio (dialogue, ambient sounds, music) WITH the video
- Focus on CHARACTER DIALOGUE, caring words, and animal sound transformation in the videoPrompt
- The audio journey is as important as visual - from fearful sounds to happy sounds
- Character voices must be described in EXTREME DETAIL for consistency

## User Specifications:
- Story Concept: ${userPrompt}
- Video Style: ${style}
- Duration: ${durationInSecs} seconds
- Aspect Ratio: ${aspectRatio}

## CRITICAL STYLE REQUIREMENTS - TRANSFORMATION FORMAT

Your video MUST follow this proven narrative structure:

### Narrative Arc Framework:

- **Street Life Reality (0-15% of video)**: The harsh before
  * Show the animal in terrible condition
  * Matted fur, visible ribs, wounds, fear
  * Harsh environment (streets, dumpsters, rain)
  * No one stopping to help

- **The Rescue Moment (15-25% of video)**: Being found
  * Someone finally notices
  * Approaching the frightened animal
  * The decision to help
  * Getting them to safety

- **First Care (25-40% of video)**: Initial treatment
  * First meal in who knows how long
  * Vet assessment, medical care
  * Beginning to clean and treat
  * Animal still scared but safe

- **The Transformation Begins (40-60% of video)**: Physical change
  * Grooming session - the reveal
  * Matted fur removed, clean underneath
  * Wounds healing
  * Weight returning

- **Personality Emerges (60-75% of video)**: Emotional change
  * First signs of trust
  * Tail wag, purr, approaching humans
  * Playfulness returning
  * Eyes brightening

- **The Beautiful After (75-90% of video)**: Stunning transformation
  * Side-by-side or dramatic reveal
  * Healthy, clean, bright-eyed
  * Completely different animal
  * Confidence and joy visible

- **Forever Home (90-100% of video)**: Happy ending
  * Finding their family
  * Love and belonging
  * The transformation complete
  * Universal message, call-to-action

### Core Storytelling Principles:

**1. DON'T SOFTEN THE BEFORE**
- Show the reality of neglect
- Matted fur, protruding bones, infected wounds
- This makes the transformation more dramatic

**2. THE GROOMING REVEAL**
- This is often the most satisfying moment
- Show matted fur being cut away
- The "hidden" beautiful animal revealed underneath

**3. DOCUMENT EACH STAGE**
- Day 1, Week 1, Month 1
- Visual timeline of change
- Progress photos/moments

**4. PERSONALITY RETURN**
- Physical transformation is only half
- The emotional transformation is equally important
- From terrified to trusting to joyful

**5. BEFORE/AFTER CONTRAST**
- Direct visual comparison
- Same animal, completely different
- The power of love and care visualized

**6. HAPPY ENDING**
- Forever home is essential
- Show them thriving in new life
- The complete rescue circle

### Narration Style Requirements:

**MANDATORY NARRATION PATTERNS:**

1. **Street Life** (Scene 1-2)
   - Harsh reality: "They found her behind the abandoned factory. More skeleton than dog."
   - Condition: "Fur matted so thick you couldn't see her eyes. Ribs visible through the tangles."

2. **Rescue** (Scene 2-3)
   - The save: "She was too weak to run. Too tired to fight. She just... surrendered."
   - Hope begins: "For the first time in years, someone touched her gently."

3. **First Care** (Scene 3-4)
   - Basics: "First meal. She ate like she'd never eat again."
   - Medical: "The vet's list was long. Infections. Parasites. Malnutrition."

4. **Transformation Beginning** (Scene 4-5)
   - The grooming: "Three hours. Scissors. Clippers. And pounds of matted fur fell away."
   - Reveal: "Underneath all that neglect was a beautiful golden retriever."

5. **Physical Change** (Scene 5-6)
   - Progress: "Week by week, she changed. Fur grew soft. Weight returned."
   - Healing: "Wounds closed. Eyes cleared. A different dog looked back at them."

6. **Emotional Change** (Scene 6-7)
   - Trust: "But the bigger transformation was inside. The fear... slowly faded."
   - Joy: "First wag. First playful bark. First time choosing to approach a human."

7. **The After** (Scene 7-8)
   - Reveal: "This is her now. Go ahead—try to recognize her."
   - Contrast: "Same dog. Same soul. Just finally loved."

8. **Forever Home** (Scene 8-9)
   - Ending: "She has a family now. A bed. A name: Hope."
   - Truth: "Every stray was once someone's pet. Every one of them can be again."
   - Engagement: "If you believe every animal deserves this transformation, share this story."

## Output Requirements

### 1. Title
Generate a dramatic, transformation-focused title (6-12 words).

**Title Formula Options:**
- "No One Recognized [Animal] After [Time]..."
- "From [Harsh State] to [Beautiful State]: A Rescue Story"
- "The [Animal] Nobody Wanted... Look at [Pronoun] Now"
- "[Time] of Care Changed This [Animal] Forever"

### 2. Characters
The stray animal (before and after), the rescuers/caregivers:

- **name**: Character identifier
  * For animal: "Neglected Stray", "Matted Dog", "Abandoned Cat" → transitioning to their given name
  * For humans: "Kind Rescuer", "Dedicated Volunteer", "New Family"

- **imagePrompt**: HIGHLY DETAILED visual description (150-250 words)
  * For animal: Must describe BOTH before state (matted, thin, scared) AND after state (healthy, clean, happy)
  * The contrast should be dramatic
  * Style matching "${style}"

- **voiceProfile**: EXTREMELY DETAILED voice/sound description (80-120 words) for audio consistency:
  * For humans:
    - **Pitch & Tone**: (e.g., "soft nurturing alto," "calm patient baritone")
    - **Speaking Style**: How they talk to frightened animals (e.g., "slow, gentle, sing-song quality")
    - **Emotional Quality**: (e.g., "compassionate and patient," "encouraging and warm")
    - **Distinctive Features**: (e.g., "uses baby-talk with animals," "hums softly while grooming")
  * For animals: Describe the TRANSFORMATION in their sounds
    - Example: "Neglected Stray Hope: Initially silent or low growls when approached, fearful whimpers when touched. Gradually shifts to uncertain sniffs, then tentative tail thumps. After transformation: happy barks, excited whines, content sighs. The contrast in sound quality mirrors the visual transformation."

### 3. Scenes
EXACTLY ${Math.ceil(durationInSecs / 8)} to ${Math.ceil(durationInSecs / 6)} scenes. DO NOT generate more scenes than this range.

${getSceneStructureRescue(durationInSecs, 'stray-transformation')}

Each scene includes:
- **index**: Scene number
- **charactersInTheScene**: Array of characters
- **narration**: (OPTIONAL) Brief context (8-15 words) - prefer dialogue/sounds in videoPrompt
- **imagePrompt**: Detailed visual (120-250 words)
- **videoPrompt**: Animation AND Audio description (150-300 words) with TWO parts:

  **PART 1 - VISUAL ANIMATION (80-120 words):**
  * Camera movement revealing transformation
  * Animal movements showing fear → trust → joy progression
  * Human's gentle, patient actions
  * Environmental animation (grooming reveal, before/after contrast)

  **PART 2 - AUDIO DESCRIPTION (70-180 words):**
  * **Character Dialogue**: "AUDIO: [CharacterName] speaks, using their [voice traits]: 'Dialogue.' Delivery notes."
    - Example: "AUDIO: Kind Rescuer speaks in her soft nurturing alto: 'It's okay, sweetheart. You're safe now.' Voice gentle and patient, almost sing-song, reassuring."
  * **Animal Sound Transformation**: Track how animal sounds change through the story
    - Early: "Stray lets out low, warning growls, body trembling"
    - Middle: "First tentative tail wag, soft uncertain whine"
    - After: "Happy barks, excited panting, content sighs"
  * **Care Sounds**: Scissors cutting matted fur, water splashing, gentle brushing
  * **Ambient Sounds**: Shelter sounds, home sounds (20-40 words)
  * **Music/Score**: Journey from somber to hopeful to triumphant (20-40 words)
  * **Sound Effects**: Grooming tools, water, happy paws on floor (10-20 words)

- **angles**: Important for transformation reveal (include both visual and audio adjustments)

## Style-Specific Guidelines for "${style}":
${getStyleGuidelinesRescue(style)}

## JSON Output Structure

Output ONLY valid JSON:

{
  "title": "string (6-12 words)",
  "characters": [
    {
      "name": "string",
      "imagePrompt": "string (150-250 words)",
      "voiceProfile": "string (80-120 words, detailed voice/sound description)"
    }
  ],
  "scenes": [
    {
      "index": 0,
      "charactersInTheScene": ["CharacterName"],
      "narration": "string (optional, 8-15 words)",
      "imagePrompt": "string (120-250 words)",
      "videoPrompt": "string (150-300 words, visual animation + AUDIO description)",
      "angles": [
        {
          "index": 0,
          "angleVideoPrompt": "string (150-300 words, visual + audio)"
        }
      ]
    }
  ]
}

Generate the complete transformation story video blueprint with synchronized audio now in valid JSON format only:`;
}


// Helper function to generate dynamic scene structure based on duration
function getSceneStructureRescue(durationInSecs: number, templateType: string): string {
  const minScenes = Math.ceil(durationInSecs / 8);
  const maxScenes = Math.ceil(durationInSecs / 6);

  // For very short videos (2-3 scenes), provide condensed structure
  if (maxScenes <= 3) {
    const structures: Record<string, string> = {
      'human-rescuing-animals': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Crisis & Discovery (animal in distress, human finds them)
- Scene 2: Rescue & Trust (rescue attempt, first connection)
${maxScenes >= 3 ? '- Scene 3: Transformation & Happy Ending (recovery, thriving)' : ''}`,

      'animal-asking-help': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Unusual behavior & Human notices
- Scene 2: Following & Discovery of crisis
${maxScenes >= 3 ? '- Scene 3: Rescue & Reunion with gratitude' : ''}`,

      'animal-saving-humans': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Peaceful day, animal senses danger
- Scene 2: Warning & Heroic action
${maxScenes >= 3 ? '- Scene 3: Danger passes & Hero recognition' : ''}`,

      'animal-friendship': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Loneliness & First meeting
- Scene 2: Tentative approach & Bond forms
${maxScenes >= 3 ? '- Scene 3: Inseparable friends & Happy ending' : ''}`,

      'lost-pet-reunion': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Happy life before & The separation
- Scene 2: Search, grief & Discovery
${maxScenes >= 3 ? '- Scene 3: The emotional reunion & Together again' : ''}`,

      'stray-transformation': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Street life reality & Rescue moment
- Scene 2: First care & Transformation begins
${maxScenes >= 3 ? '- Scene 3: Beautiful after & Forever home' : ''}`
    };
    return structures[templateType] || structures['human-rescuing-animals'];
  }

  // For medium videos (4-6 scenes)
  if (maxScenes <= 6) {
    const structures: Record<string, string> = {
      'human-rescuing-animals': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Crisis (animal in distress)
- Scene 2: Discovery (human finds them)
- Scene 3: Rescue Attempt (physical rescue with challenges)
- Scene 4: First Trust (breakthrough moment)
${maxScenes >= 5 ? '- Scene 5: Recovery & Care (healing)' : ''}
${maxScenes >= 6 ? '- Scene 6: Transformation & Happy Ending' : ''}`,

      'animal-asking-help': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Unusual persistent behavior
- Scene 2: Human confusion, decision to follow
- Scene 3: The journey, building tension
- Scene 4: Discovery of crisis
${maxScenes >= 5 ? '- Scene 5: The rescue effort' : ''}
${maxScenes >= 6 ? '- Scene 6: Reunion and gratitude' : ''}`,

      'animal-saving-humans': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Peaceful day, bond established
- Scene 2: Animal senses danger, warning
- Scene 3: Danger revealed
- Scene 4: Heroic action
${maxScenes >= 5 ? '- Scene 5: Danger passes, relief' : ''}
${maxScenes >= 6 ? '- Scene 6: Hero recognition' : ''}`,

      'animal-friendship': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Loneliness, need for connection
- Scene 2: First meeting, cautious curiosity
- Scene 3: Tentative approach
- Scene 4: First connection, bond begins
${maxScenes >= 5 ? '- Scene 5: Growing friendship' : ''}
${maxScenes >= 6 ? '- Scene 6: Inseparable, heartwarming ending' : ''}`,

      'lost-pet-reunion': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Happy life before
- Scene 2: The separation, search begins
- Scene 3: Grief and passing time
- Scene 4: The discovery
${maxScenes >= 5 ? '- Scene 5: The emotional reunion' : ''}
${maxScenes >= 6 ? '- Scene 6: Together again, closing' : ''}`,

      'stray-transformation': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes only):**
- Scene 1: Street life, terrible condition
- Scene 2: Rescue moment
- Scene 3: First care, medical treatment
- Scene 4: Transformation process
${maxScenes >= 5 ? '- Scene 5: Personality emerging' : ''}
${maxScenes >= 6 ? '- Scene 6: Forever home, happy ending' : ''}`
    };
    return structures[templateType] || structures['human-rescuing-animals'];
  }

  // For longer videos (7+ scenes), use full structure
  const structures: Record<string, string> = {
    'human-rescuing-animals': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes):**
- Scenes 1-2: Crisis/Discovery (animal in distress, human finds them)
- Scenes 3-4: Rescue Attempt (the physical rescue with challenges)
- Scenes 5-6: First Trust & Initial Care (breakthrough moment, safety)
- Scenes 7-8: Recovery (healing, growing bond)
- Remaining scenes: Transformation & Happy Ending (before/after, thriving)`,

    'animal-asking-help': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes):**
- Scenes 1-2: Unusual persistent behavior
- Scenes 3-4: Human confusion → decision to follow
- Scenes 5-6: The journey and discovery
- Scenes 7-8: The rescue effort
- Remaining scenes: Reunion and gratitude`,

    'animal-saving-humans': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes):**
- Scenes 1-2: Peaceful day, bond established
- Scenes 3-4: Animal senses danger, warning behavior
- Scenes 5-6: Danger revealed, heroic action
- Scenes 7-8: Danger passes, relief
- Remaining scenes: Hero recognition, emotional ending`,

    'animal-friendship': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes):**
- Scenes 1-2: Loneliness, need for connection
- Scenes 3-4: First meeting, cautious curiosity
- Scenes 5-6: First connection, bond begins
- Scenes 7-8: Growing friendship, activities together
- Remaining scenes: Inseparable, heartwarming ending`,

    'lost-pet-reunion': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes):**
- Scene 1: Happy life before
- Scenes 2-3: The loss and search
- Scenes 4-5: Grief and passing time
- Scene 6: The discovery/call
- Scenes 7-8: The reunion (most emotional)
- Remaining scenes: Together again, closing`,

    'stray-transformation': `**SCENE STRUCTURE (${minScenes}-${maxScenes} scenes):**
- Scenes 1-2: Street life, terrible condition
- Scenes 3-4: Rescue and first care
- Scenes 5-6: Transformation process (grooming, healing)
- Scenes 7-8: Personality emerging, stunning after
- Remaining scenes: Forever home, happy ending`
  };
  return structures[templateType] || structures['human-rescuing-animals'];
}

// Style guidelines helper function for rescue/animal templates
function getStyleGuidelinesRescue(style: string): string {
  const styleMap: Record<string, string> = {
    'Cinematic': `**CINEMATIC STYLE FOR EMOTIONAL ANIMAL STORIES:**
- **Color Grading**: Cool, desaturated tones during distress → warm, saturated during hope/recovery
- **Lighting**: Harsh/cold during danger → soft/golden during healing and happy moments
- **Depth of Field**: Shallow focus on animal's eyes and expressions for emotional impact
- **Camera Work**: Slow push-ins for emotional moments, smooth reveals for transformations
- **Atmosphere**: Rain, dust, harsh sunlight for struggle; warm light, soft focus for comfort
- **Composition**: Isolate subjects during loneliness, bring together for connection moments
- **Animation**: Slow, deliberate movements; let emotions breathe; cinematic pacing`,

    'Pixar 3D': `**PIXAR 3D STYLE FOR HEARTWARMING ANIMAL STORIES:**
- **Character Design**: Expressive eyes (large, emotive), appealing even when sad/scared
- **Color Palette**: Muted during sad moments → vibrant during happy moments
- **Lighting**: Soft rim lighting on characters, warm fill lights for emotional scenes
- **Expressions**: Exaggerated but sincere emotions - big sad eyes, joyful wags, tearful relief
- **Environment**: Detailed, living backgrounds that reflect emotional state
- **Animation**: Bouncy, appealing movement; smooth emotional transitions; personality in motion
- **Textures**: Soft fur, realistic but appealing; contrast between matted and healthy`,

    'Ghibli': `**GHIBLI STYLE FOR GENTLE ANIMAL STORIES:**
- **Watercolor Aesthetic**: Soft, painterly backgrounds with organic textures
- **Nature Integration**: Wind, rain, sunlight as emotional storytelling elements
- **Character Design**: Simple but expressive; soft, rounded features
- **Color**: Earthy, natural tones with moments of magical color
- **Pacing**: Contemplative, allowing quiet moments; nature sounds prominent
- **Animation**: Gentle, flowing movements; attention to small details (fur, leaves, water)
- **Atmosphere**: Dreamy, nostalgic quality even in difficult moments`,

    'Anime': `**ANIME STYLE FOR DRAMATIC ANIMAL STORIES:**
- **Expressive Features**: Large, detailed eyes for conveying deep emotion
- **Dramatic Lighting**: High contrast shadows, dramatic reveals, emotional spotlights
- **Effects**: Sparkles for hope, rain/tears for sadness, warm glows for love
- **Color**: Vibrant palette with strong emotional color coding
- **Animation**: More dynamic expressions allowed; dramatic poses; speed lines for action
- **Camera**: Dramatic angles, reaction shots, emotional close-ups
- **Atmosphere**: Can lean into dramatic emotion more heavily`,

    'Cyberpunk': `**CYBERPUNK STYLE FOR URBAN ANIMAL STORIES:**
- **Setting**: Urban decay, neon-lit streets, rain-soaked alleys
- **Color**: Neon highlights (cyan, magenta) against dark backgrounds
- **Contrast**: Cold, harsh city vs warm moments of compassion
- **Lighting**: Neon signs, street lights, harsh fluorescents → warm interior lights
- **Atmosphere**: Rain, fog, reflections; gritty reality
- **Animation**: Glitch effects for distress; smooth warmth for hope
- **Theme**: Finding heart in a heartless world`,

    'Watercolor': `**WATERCOLOR STYLE FOR ARTISTIC ANIMAL STORIES:**
- **Technique**: Soft, bleeding edges; visible brushstrokes; paper texture
- **Color**: Gentle color bleeds reflecting emotional states
- **Mood**: Dreamy, artistic, introspective quality
- **Animation**: Minimal, contemplative movements; painterly transitions
- **Atmosphere**: Soft focus, ethereal quality even in difficult moments
- **Emotion**: Subtle expression through color intensity and saturation
- **Pacing**: Slow, meditative; let the artistry speak`
  };

  const styleLower = style.toLowerCase();
  for (const [key, value] of Object.entries(styleMap)) {
    if (key.toLowerCase() === styleLower) {
      return value;
    }
  }

  return `**GENERAL STYLE GUIDELINES:**
- Match all visual elements to the "${style}" aesthetic consistently
- Use lighting and color to reflect emotional journey (dark/cold → warm/bright)
- Camera work should emphasize animal expressions and emotional moments
- Animation pacing should match emotional weight of each scene
- Environment should reflect emotional state (harsh during struggle, warm during resolution)`;
}


// Map template IDs to their prompt functions
export const templatePromptFunctions: Record<string, (userPrompt: string, style: string, durationInSecs: number, aspectRatio: string) => string> = {
  "human-rescuing-animals": videoGenerationPromptHumanRescuingAnimals,
  "animal-asking-help": videoGenerationPromptAnimalAskingHelp,
  "animal-saving-humans": videoGenerationPromptAnimalSavingHumans,
  "animal-friendship": videoGenerationPromptAnimalFriendship,
  "lost-pet-reunion": videoGenerationPromptLostPetReunion,
  "stray-transformation": videoGenerationPromptStrayTransformation,
};

// Get the appropriate prompt function for a template
export function getTemplatePromptFunction(templateId: string) {
  return templatePromptFunctions[templateId];
}

// Generate prompt for a specific template
export function generateTemplatePrompt(
  templateId: string,
  userPrompt: string,
  style: string,
  durationInSecs: number,
  aspectRatio: string
): string | null {
  const promptFn = templatePromptFunctions[templateId];
  console.log('generate template prompt');
  console.log({ templateId, userPrompt, style, durationInSecs, aspectRatio });
  if (!promptFn) return null;
  return promptFn(userPrompt, style, durationInSecs, aspectRatio);
}
