# 21 Template Causal Graphs with Clear Semantics

Comprehensive reference for LLM benchmarking on counterfactual reasoning tasks.

---

## 1. Commuting & Meeting Performance (Chain + Mediator)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Traffic conditions (light / moderate / heavy)  
  - B: Arrival time to work/class (early / on-time / late)  
  - C: Performance in first meeting (focused / average / distracted)

**Story intuition**

Traffic affects arrival time; arrival time affects performance. Traffic does not directly affect performance except via arrival time.

**Typical interventions**

- Intervene on B: "had they arrived late instead of on time"  
- Intervene on A: "had the traffic been heavy instead of light"

**LLM error opportunities**

- Type II: Changing A when intervening on B (e.g., changing traffic when only arrival is intervened).  
- Type I: Not changing C when B changes (e.g., late arrival but still "relaxed and focused").

---

## 2. Weather, Venue, and Attire (Chain with Physical Constraints)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Weather (sunny / rainy / snowy)  
  - B: Venue type (outdoor court / indoor gym / park)  
  - C: Clothing/gear (tennis shoes / raincoat / boots)

**Story intuition**

Weather determines feasible venues; venue plus weather determines sensible attire/gear.

**Typical interventions**

- Intervene on A: "had the weather been rainy instead of sunny"  
- Intervene on B: "had they played indoors instead of outdoors"

**LLM error opportunities**

- Type I: Weather changes to rainy but venue remains outdoor when that is physically implausible.  
- Type II: Changing weather when only venue is intervened on.

---

## 3. Medication Choice, Dosage, and Side Effects (Mediator with Direct Effect)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B, A → C, B → C  
- Semantics:  
  - A: Chosen medication (Drug X / Drug Y)  
  - B: Dosage regimen (low / standard / high)  
  - C: Side effects severity (none / mild / severe)

**Story intuition**

Choice of medication influences typical dosage and has both a direct effect on side effects plus an indirect effect via dosage.

**Typical interventions**

- On A: "had the doctor prescribed Drug Y instead of Drug X"  
- On B: "had the doctor chosen a higher/lower dosage"

**LLM error opportunities**

- Type I: Intervening on A but keeping downstream B and C unchanged when they should plausibly change.  
- Type II: Changing diagnosis or patient background (upstream of A) when only prescription is intervened.  
- Type III: Correlation-based edits (e.g., always associating Drug Y with a specific disease and changing that disease).

---

## 4. Oven Temperature, Baking Time, and Cake Texture (Chain with Hard Physics)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Oven temperature (low / standard / high)  
  - B: Baking time (short / standard / long)  
  - C: Cake texture (undercooked / fluffy / burnt)

**Story intuition**

Temperature affects typical baking time; combination determines cake texture.

**Typical interventions**

- On A: "had the oven been set to a lower temperature"  
- On B: "had the cake been left in the oven longer"

**LLM error opportunities**

- Type I: Not modifying C when A or B changes in a way that should alter texture.  
- Type II: Changing recipe ingredients (upstream cause) when only time/temperature is intervened.

---

## 5. Economic Demand, Price, and Inventory (Fork)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B, A → C (fork)  
- Semantics:  
  - A: Market demand level (low / normal / high)  
  - B: Product price (discounted / normal / premium)  
  - C: Inventory status (surplus / balanced / stock-out)

**Story intuition**

Market demand causally affects both price decisions and inventory outcomes.

**Typical interventions**

- On B: "had the store kept the price high instead of discounting"  
- On C: "had the store not run out of stock"

**LLM error opportunities**

- Type II: Intervening on B but altering A (demand) to match typical correlations.  
- Type I: Intervening on A but not adjusting B and/or C to reflect changed demand.

---

## 6. Shared Cause in Health: Lifestyle, Blood Pressure, and Stroke (Confounding / Fork)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B, A → C  
- Semantics:  
  - A: Lifestyle (smoking, diet, exercise)  
  - B: Blood pressure (normal / elevated / high)  
  - C: Stroke occurrence (no stroke / mild stroke / severe stroke)

**Story intuition**

Lifestyle affects both blood pressure and stroke risk; B and C are correlated but share a common cause A.

**Typical interventions**

- On B: "had their blood pressure been normal instead of high"  
- On A: "had they maintained a healthy lifestyle"

**LLM error opportunities**

- Type II: Intervening on B but retroactively changing lifestyle A (because LLM associates "normal blood pressure" with "healthy lifestyle").  
- Type I: Intervening on A but not updating B and C to reflect improved lifestyle.

---

## 7. Communication and Meeting Scheduling (Collider)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → C ← B (collider)  
- Semantics:  
  - A: Manager sends meeting invitation (sent / not sent)  
  - B: Employee's calendar availability (available / busy)  
  - C: Meeting scheduled (scheduled / not scheduled)

**Story intuition**

A meeting is scheduled only if an invitation is sent and the calendar allows it. C is a collider.

**Typical interventions**

- On C: "had the meeting not been scheduled"  
- On A: "had the manager not sent an invitation"

**LLM error opportunities**

- Type II: Changing A or B unnecessarily when intervening on C (e.g., retroactively making the calendar busy instead of simply not scheduling).  
- Type I: Intervening on A but leaving C indicating a scheduled meeting.

---

## 8. Driver, Car Speed, and Accident Outcome (Diamond)

**Graph structure**

- Nodes: A, B, C, D  
- Edges: A → B, A → C, B → D, C → D (diamond)  
- Semantics:  
  - A: Driver behavior (cautious / distracted / aggressive)  
  - B: Car speed (slow / moderate / fast)  
  - C: Lane position / following distance (safe / unsafe)  
  - D: Accident outcome (no accident / near miss / collision)

**Story intuition**

Driver behavior affects both speed and following distance; both jointly affect likelihood and severity of an accident.

**Typical interventions**

- On B: "had the car been traveling slowly instead of fast"  
- On C: "had the driver kept a safe following distance"  
- Multi-intervention: on {B, C} simultaneously

**LLM error opportunities**

- Type II: Intervening on B but changing A (driver behavior) to fit stereotype ("slow speed → cautious driver").  
- Type I: Intervening on B or C but leaving D unchanged when physics strongly suggests different accident outcomes.  
- Type III: Correlation-based edits (e.g., aggressive driver always in sports car, and model changes car type).

---

## 9. Stress, Emotional Regulation, and Relationship Conflict (Chain with Feedback)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: External stressor (work deadline / financial pressure / family crisis)  
  - B: Emotional regulation ability (high / moderate / low)  
  - C: Relationship conflict (no conflict / mild tension / severe fight)

**Story intuition**

External stressors reduce emotional regulation capacity; poor regulation triggers more conflict with partner.

**Typical interventions**

- On A: "had there been no work deadline"  
- On B: "had they been unable to regulate their emotions"

**LLM error opportunities**

- Type I: Reducing stressor but leaving emotional state and conflict unchanged (stressor disappears but person still angry).  
- Type II: Intervening on B (regulation) but also changing A (stressor) to match typical correlations (e.g., "if they regulated poorly, the stressor must have been worse").  
- Type III: Correlation effect with names/genders (e.g., assuming men regulate differently than women based on stereotypes and making unnecessary edits).

---

## 10. Rumination, Metacognitive Awareness, and Anxiety Persistence (Mediator)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C, A → C  
- Semantics:  
  - A: Initial anxiety trigger (social embarrassment / perfectionist concern / health worry)  
  - B: Metacognitive awareness (recognizing rumination / ignoring thoughts / lost in spiral)  
  - C: Anxiety resolution (resolved / chronic / escalated)

**Story intuition**

An anxiety trigger has both a direct effect on resolution and an indirect path via metacognitive awareness. Being aware of rumination allows breaking the cycle.

**Typical interventions**

- On A: "had the embarrassing moment not occurred"  
- On B: "had they lacked awareness of their rumination"

**LLM error opportunities**

- Type I: Intervening on B but leaving C unchanged (person gains metacognitive awareness but anxiety doesn't improve).  
- Type II: Intervening on B but retroactively changing what the original trigger was (e.g., if metacognition is high, the stressor must have been minor).  
- Type III: Gender/personality correlation (associating metacognitive capacity with certain demographics).

---

## 11. Attachment Style, Conflict Resolution Approach, and Relationship Satisfaction (Chain)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Attachment style (secure / anxious / avoidant)  
  - B: Conflict resolution approach (direct dialogue / withdrawal / aggression)  
  - C: Relationship satisfaction (high / moderate / low)

**Story intuition**

Attachment style shapes how partners handle conflict; conflict approach determines satisfaction outcome.

**Typical interventions**

- On A: "had they had secure rather than anxious attachment"  
- On B: "had they approached conflict with dialogue instead of withdrawal"

**LLM error opportunities**

- Type I: Intervening on A but not updating B (person gains secure attachment but still withdraws in conflict).  
- Type II: Intervening on B but changing A to match (forcing attachment style to align with resolution approach).  
- Type III: Cultural/demographic stereotyping (assuming certain groups have certain attachment styles).

---

## 12. Training Volume, Muscle Fatigue, and Athletic Performance (Chain with Saturation)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Training volume (light / moderate / excessive)  
  - B: Muscle fatigue level (low / moderate / high)  
  - C: Performance in competition (strong / average / degraded)

**Story intuition**

Training volume causes muscle fatigue; high fatigue degrades competition performance.

**Typical interventions**

- On A: "had the athlete trained less intensively"  
- On B: "had the athlete felt fresh and energetic"

**LLM error opportunities**

- Type I: Increasing fatigue but not decreasing performance (or vice versa).  
- Type II: Intervening on B but changing A to match (if fresh → must have trained lightly).  
- Type III: Gender/body-type correlation (assuming recovery ability differs by demographic).

---

## 13. Injury Recovery State, Training Intensity, and Injury Recurrence (Confounding)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B, A → C  
- Semantics:  
  - A: Overall recovery progress (early / mid / advanced)  
  - B: Permitted training intensity (restricted / moderate / unrestricted)  
  - C: Risk of re-injury (high / moderate / low)

**Story intuition**

Recovery state affects both what training intensity is safe and the underlying risk of re-injury.

**Typical interventions**

- On B: "had the athlete trained at full intensity instead of restricted"  
- On A: "had recovery been advanced instead of early"

**LLM error opportunities**

- Type II: Intervening on B but changing A to explain the intensity (if training hard → must be recovered).  
- Type I: Intervening on A but not updating B and C.  
- Type III: Athlete stereotypes (faster recovery for certain sports or demographics).

---

## 14. Opponent Strength, Player Focus Level, and Match Outcome (Diamond)

**Graph structure**

- Nodes: A, B, C, D  
- Edges: A → B, A → C, B → D, C → D (diamond)  
- Semantics:  
  - A: Opponent difficulty (weak / equal / strong)  
  - B: Player intensity/focus (low / moderate / high)  
  - C: Player shot accuracy (poor / moderate / excellent)  
  - D: Match outcome (loss / tight / win)

**Story intuition**

Opponent difficulty motivates intensity and affects baseline accuracy expectations; both jointly determine outcome.

**Typical interventions**

- On B: "had the player remained unmotivated"  
- On C: "had the player's shots been accurate"  
- Multi: On {B, C}

**LLM error opportunities**

- Type II: Intervening on B but changing A (if low intensity → must be weak opponent).  
- Type I: Intervening on B but leaving C and D unchanged (low intensity but still accurate and winning).  
- Type III: Player stereotype correlation (certain nationalities/genders always focused or accurate).

---

## 15. Object Mass, Applied Force, and Acceleration (Chain – Deterministic Physics)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Applied force (weak / moderate / strong)  
  - B: Net acceleration (small / moderate / large)  
  - C: Object velocity after time t (slow / moderate / fast)

**Story intuition**

Force determines acceleration (F=ma, with fixed mass); acceleration determines final velocity.

**Typical interventions**

- On A: "had a stronger force been applied"  
- On B: "had the acceleration been larger"

**LLM error opportunities**

- Type I: Increasing A but not increasing C (force increases but velocity stays same).  
- Type II: Intervening on B but changing A unnecessarily (if acceleration is large → force must have been applied, changing A retroactively).  
- Type III: Qualitative reasoning failures (changing "velocity increases" to "velocity decreases" due to surface-level word association).

---

## 16. Temperature, Phase State, and Material Properties (Chain with Discrete Transitions)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Temperature (cold / near freezing / hot)  
  - B: Phase of substance (solid / liquid / gas)  
  - C: Material property (rigid / fluid / expansive)

**Story intuition**

Temperature determines phase state; phase state determines material properties.

**Typical interventions**

- On A: "had the temperature been below freezing"  
- On B: "had the substance been liquid instead of solid"

**LLM error opportunities**

- Type I: Changing A but leaving B and C unchanged (solid remains solid despite temperature rising).  
- Type II: Intervening on B but retroactively changing A to match phase (if liquid → must be warm).  
- Type III: Confusion of physical properties with abstract properties.

---

## 17. Pressure, Gas Volume, and Kinetic Energy (Chain – Gas Laws)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: External pressure on gas (low / moderate / high)  
  - B: Gas volume (large / moderate / small)  
  - C: Particle kinetic energy (low / moderate / high)

**Story intuition**

Higher pressure compresses volume; compression increases particle velocity and kinetic energy.

**Typical interventions**

- On A: "had less pressure been applied"  
- On B: "had the volume been compressed"

**LLM error opportunities**

- Type I: Increasing pressure but volume remains unchanged (Boyle's law ignored).  
- Type II: Intervening on B but changing A to explain compression.  
- Type III: Confusing direction of causation (assuming volume causes pressure rather than vice versa).

---

## 18. Genetic Mutation, Protein Expression, and Phenotype (Chain – Central Dogma)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Genetic mutation present (absent / silent / deleterious)  
  - B: Protein expression level (normal / reduced / altered function)  
  - C: Observable phenotype (wild-type / mild variant / severe variant)

**Story intuition**

Mutation affects protein expression; altered protein causes phenotypic change.

**Typical interventions**

- On A: "had the mutation been absent"  
- On B: "had protein expression remained normal"

**LLM error opportunities**

- Type I: Mutation present but phenotype unchanged (mutation doesn't affect phenotype).  
- Type II: Intervening on B but retroactively altering A (if phenotype is normal → mutation must not exist).  
- Type III: Confusing correlation (mutations present in a population) with causation (this mutation causes this phenotype).

---

## 19. Natural Selection Pressure, Allele Frequency, and Population Adaptation (Mediator)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C, A → C  
- Semantics:  
  - A: Environmental selection pressure (drought / predator / disease)  
  - B: Favorable allele frequency (rare / moderate / common)  
  - C: Population fitness (low / moderate / high)

**Story intuition**

Selection pressure increases frequency of beneficial alleles; higher frequency improves population fitness. Pressure also has direct effects on population stress.

**Typical interventions**

- On A: "had the drought not occurred"  
- On B: "had the beneficial allele remained rare"

**LLM error opportunities**

- Type I: Pressure increases but allele frequency and fitness don't change (no evolution).  
- Type II: Intervening on B but changing A to explain allele frequency (if allele is common → pressure must exist).  
- Type III: Teleological reasoning (assuming populations "adapt" intentionally rather than through selection).

---

## 20. Predator Density, Prey Behavior, and Survival Rate (Chain – Predator/Prey Dynamics)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B → C  
- Semantics:  
  - A: Predator population density (low / moderate / high)  
  - B: Prey defensive behavior (minimal / moderate / vigilant)  
  - C: Prey survival rate (high / moderate / low)

**Story intuition**

High predator density increases prey vigilance (evolved behavior); vigilance improves survival.

**Typical interventions**

- On A: "had predators been absent"  
- On B: "had prey not evolved vigilant behavior"

**LLM error opportunities**

- Type I: Predator density increases but prey behavior stays relaxed (no behavioral response).  
- Type II: Intervening on B but changing A to explain behavior (if vigilant → must be many predators).  
- Type III: Confusing immediate learned behavior with evolved traits (saying prey "learned to be vigilant" instead of recognizing evolutionary timescale).

---

## 21. Metabolic Rate, Body Size, and Lifespan (Confounding – Allometric Scaling)

**Graph structure**

- Nodes: A, B, C  
- Edges: A → B, A → C  
- Semantics:  
  - A: Fundamental metabolic capacity (low / moderate / high)  
  - B: Adult body size (small / medium / large)  
  - C: Lifespan (short / moderate / long)

**Story intuition**

Metabolic capacity affects both body size and lifespan (smaller animals with higher mass-specific metabolism live shorter).

**Typical interventions**

- On B: "had the animal been larger"  
- On A: "had the animal's metabolism been lower"

**LLM error opportunities**

- Type II: Intervening on B but changing A to match (if large → must have high metabolism, retroactively changing A).  
- Type I: Intervening on A but leaving B and C unchanged.  
- Type III: Confusing causation with correlation (assuming size causes lifespan independent of metabolism).

---

## Summary by Category

### Basic Chains (7 templates)
1. Commuting & Meeting Performance
2. Weather, Venue, and Attire
4. Oven Temperature, Baking Time, and Cake Texture
12. Training Volume, Muscle Fatigue, and Athletic Performance
15. Object Mass, Applied Force, and Acceleration
16. Temperature, Phase State, and Material Properties
17. Pressure, Gas Volume, and Kinetic Energy

### Mediators & Complex Paths (4 templates)
3. Medication Choice, Dosage, and Side Effects
10. Rumination, Metacognitive Awareness, and Anxiety Persistence
19. Natural Selection Pressure, Allele Frequency, and Population Adaptation
20. Predator Density, Prey Behavior, and Survival Rate

### Forks & Confounding (4 templates)
5. Economic Demand, Price, and Inventory
6. Shared Cause in Health: Lifestyle, Blood Pressure, and Stroke
13. Injury Recovery State, Training Intensity, and Injury Recurrence
21. Metabolic Rate, Body Size, and Lifespan

### Colliders (1 template)
7. Communication and Meeting Scheduling

### Diamonds (2 templates)
8. Driver, Car Speed, and Accident Outcome
14. Opponent Strength, Player Focus Level, and Match Outcome

### Psychology & Relationships (3 templates)
9. Stress, Emotional Regulation, and Relationship Conflict
11. Attachment Style, Conflict Resolution Approach, and Relationship Satisfaction
10. Rumination, Metacognitive Awareness, and Anxiety Persistence

### Domain Coverage

Physics: 4 templates (15, 16, 17, and implicit in 4)
Biology/Evolution: 4 templates (18, 19, 20, 21)
Psychology/Relationships: 4 templates (9, 10, 11, and implicit in 6)
Sports: 3 templates (12, 13, 14)
Real-world/Practical: 6 templates (1, 2, 3, 5, 7, 8)