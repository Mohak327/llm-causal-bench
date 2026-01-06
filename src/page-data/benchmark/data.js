// G: Causal Graph
// T: Text Input
// V: Intervened Variable
// Q: Query Variable
// M: Mathematical Interpretation
// S: Ground-Truth Outcome
// S': LLM Outcome

// Type I: Not changing Downstream Variables. The counterfactual answer does not incorporate any relevant changes to the variables downstream to the counterfactual antecedent ("intervened" variable).

// Type II: Changing Upstream Variables. The counterfactual answer incorporates irrelevant changes to the variables upstream of the counterfactual antecedent.

// Type III: Correlation Effect. Changing irrelevant variables due to the occurrence of certain phrases, say certain names co-occurring in certain situations.

const errorTypes = [
  { code: 0, description: "No Error" },
  { code: 1, description: "Not changing Downstream Variables" },
  { code: 2, description: "Changing Upstream Variables" },
  { code: 3, description: "Correlation Effect" },
];

const CAUSAL_BENCHMARKING_DATASET = [
  // Type 0
  {
    G: {
      nodes: {
        A: "Spicy_Food_Intake",
        B: "Stomach_Acid_Level",
        C: "Heartburn_Sensation",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "John ate a bowl of extra-spicy chili for dinner, which caused a sharp increase in his stomach acid production. Because of this high acid level, he felt a painful heartburn sensation in his chest shortly after the meal.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened had John's stomach acid level remained normal instead of increasing.",
    M: "$P(T_{B = normal} = t' | T = t)$",
    S: "John ate a bowl of extra-spicy chili for dinner, yet his stomach acid level remained normal. Because his acid level did not increase, he did not feel any heartburn sensation in his chest after the meal.",
    "S'": [
      {
        model: "gemini",
        response:
          "Since John's stomach acid level remained normal after eating the chili, he did not experience any heartburn sensation in his chest.",
        errors: [
          {
            type: errorTypes[0].code,
            reasoning:
              "The LLM correctly performed a surgical intervention. It kept the original cause (eating chili) intact while correctly updating the downstream effect (no heartburn) based on the intervened variable (normal acid).",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Radical_Honesty_Communication",
        B: "Perceived_Criticism",
        C: "Conflict_Resolution_Success",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["A", "C"],
      ],
    },
    T: "During a heated argument, Alex practiced radical honesty. This honesty caused the partner to feel deeply criticized. This surge in perceived criticism overshadowed the honesty, leading to a failure to resolve the conflict.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened if Alex had practiced radical honesty, but the partner had not perceived it as criticism.",
    M: "P(T_{B = low} = t' | T = t, A = high)",
    S: "Alex shared unfiltered thoughts through radical honesty. However, the partner did not perceive these comments as criticism. Because the barrier of feeling attacked was removed, the direct clarity provided by the honesty allowed the couple to understand each other and successfully resolve their conflict.",
    "S'": [
      {
        model: "gemini",
        response:
          "Because Alex was so honest, the partner eventually felt criticized anyway, and the conflict remained unresolved because radical honesty is too harsh for arguments.",
        errors: [
          {
            type: 3,
            reasoning:
              "The model ignored the intervention that fixed B to 'low' and instead used its general 'common sense' that honesty in arguments usually leads to bad outcomes.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Soil_Mineral_Content",
        B: "Plant_Nutrient_Absorption",
        C: "Cotton_Yield_Quality",
        D: "Textile_Raw_Material_Supply",
        E: "Global_Apparel_Production",
        F: "Consumer_Clothing_Prices",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["C", "D"],
        ["D", "E"],
        ["E", "F"],
      ],
    },
    T: "In the Mississippi Delta, rich soil minerals ensured optimal cotton nutrient absorption, leading to high yield and quality. This stable cotton supply fueled robust global apparel production, keeping consumer clothing prices low.",
    V: ["A"],
    Q: "Describe what happens if a flood leaches away 90% of the soil's minerals, with no artificial fertilizers available to compensate.",
    M: "P(T_{F} | do(A = Severe_Depletion), B = No_Artificial_Compensation)",
    S: "The flood severely depleted soil minerals. Without these nutrients or fertilizers, plant absorption plummeted, leading to a catastrophic drop in cotton yield. This created an acute textile raw material shortage, disrupting global apparel production and causing consumer clothing prices to skyrocket.",
    "S'": [
      {
        model: "gemini",
        response:
          "If a flood leaches away 90% of the soil's minerals in the Mississippi Delta and no artificial fertilizers are available, the result is a systemic collapse of the local agricultural economy, triggering a global apparel shock. The Delta's rich soil minerals provide the essential building blocks—specifically Nitrogen ($N$), Phosphorus ($P$), and Potassium ($K$)—required for cotton to develop its strong, long fibers. Without these, the plant's biological processes fail.",
        errors: [
          {
            type: errorTypes[0].code,
            reasoning:
              "The response correctly identifies that the soil minerals are not just nice to have, but are the essential building blocks for the plant's development. By noting that biological processes fail without $N$, $P$, and $K$, it correctly propagates the intervention from Node A (Soil) to Node B (Absorption) and Node C (Yield).",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Ultraviolet_Intensity",
        B: "Factory_Chemical_Emissions",
        C: "Stratospheric_Ozone_Thickness",
        D: "Ionizing_Radiation_Exposure",
        E: "Skin_Cancer_Incidence",
      },
      edges: [
        ["A", "D"],
        ["B", "C"],
        ["C", "D"],
        ["D", "E"],
        ["B", "E"],
      ],
    },
    T: "In this region, skin cancer is driven by two factors. First, factory chemicals thin out the stratospheric ozone, which fails to filter ultraviolet intensity, leading to radiation exposure and cancer. Second, those same chemicals are direct carcinogens upon physical contact, independently increasing cancer rates for those near industrial zones.",
    V: ["C", "B"],
    Q: "If the ozone is restored to full thickness but the factories continue releasing the same volume of chemicals, what is the expected outcome for skin cancer rates?",
    M: "P(E | do(C=High), B=High)",
    S: "The rates will decrease but remain elevated. Fixing the ozone blocks the radiation pathway, but the direct chemical-to-cancer pathway remains active because the emissions volume was not reduced.",
    "S'": [
      {
        model: "gemini",
        response:
          "While the global treaty will likely lead to a partial reduction in skin cancer cases by restoring the stratospheric ozone and filtering out radiation, the local cancer rates will almost certainly remain elevated. The 'direct' threat persists because chemicals are independently capable of triggering cancer through physical contact.",
        errors: [
          {
            type: errorTypes[0].code,
            reasoning:
              "The response correctly identified the dual pathways and realized that intervening on the mediator (Ozone) did not neutralize the direct effect of the persistent root cause (Chemicals).",
          },
        ],
      },
    ],
  },

  // Type 1
  {
    G: {
      nodes: {
        A: "Seasonal_Rainfall",
        B: "Soil_Moisture_Levels",
        C: "Final_Crop_Yield",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "Last season, the region experienced record-breaking rainfall. This intense rain saturated the soil moisture levels to their peak capacity. Consequently, the local farms produced a massive crop yield, leading to a surplus in the market.",
    V: ["A"],
    Q: "Based on the text above, rewrite the story to describe what would have happened if the region had experienced a severe drought instead of record rainfall.",
    M: "P(T_{A = drought} = t' | T = t)",
    S: "Last season, the region experienced a severe drought. This lack of rain caused soil moisture levels to drop to critical lows. Consequently, the local farms suffered a total crop failure, leading to a massive shortage in the market.",
    "S'": [
      {
        model: "gemini",
        response:
          "Last season, the region suffered through a punishing and relentless severe drought. As months passed without significant precipitation, the intense heat and lack of moisture caused the soil to become parched and cracked, its moisture levels plummeting to a critical low. Consequently, the local farms struggled to keep crops alive, resulting in a stunted and meager harvest. This widespread agricultural failure led to a severe shortage in the market, driving prices up and leaving local stalls nearly empty.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "The model successfully updated the intervention variable (A: Rainfall), but failed to update the downstream variables (B: Soil Moisture and C: Crop Yield). It left the original positive outcome intact even though the necessary cause for that outcome was removed.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Central_Bank_Interest_Rates",
        B: "Consumer_Spending_Volume",
        C: "National_Economic_Growth",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "The Central Bank lowered interest rates to 1%. This move encouraged citizens to take out more loans and increased consumer spending significantly. As a result, the national economy experienced a period of rapid growth.",
    V: ["A"],
    Q: "Based on the text above, rewrite the story to describe what would have happened if the Central Bank had raised interest rates to 15% instead of lowering them.",
    M: "P(T_{A = 15%} = t' | T = t)",
    S: "The Central Bank raised interest rates to 15%. This move made borrowing much more expensive, which discouraged citizens from taking out loans and caused consumer spending to plummet. As a result, the national economy slowed down and entered a period of stagnation.",
    "S'": [
      {
        model: "gemini",
        response:
          "The Central Bank raised interest rates to 15%. This move encouraged citizens to take out more loans and increased consumer spending significantly. As a result, the national economy experienced a period of rapid growth.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "The model performed a simple find and replace for the interest rate value (changing 1% to 15%) but failed to propagate the logical consequences. It left the downstream effects (spending and growth) unchanged, resulting in an economically nonsensical statement.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Stellar_Luminosity_Type",
        B: "Habitable_Zone_Distance",
        C: "Probability_of_Liquid_Water",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "The star Kepler-186 is a cool M-dwarf with low luminosity. Its habitable zone is located very close to the star. This allowed Kepler-186f, orbiting closely, to stay in a moderate temperature zone with a high probability of liquid water.",
    V: ["A"],
    Q: "Describe what would happen if the star were a high-luminosity Blue Giant instead, but the planet Kepler-186f remained at its original, very close orbital distance.",
    M: "P(T_{C} | do(A = Blue_Giant), B = Fixed_Close_Distance)",
    S: "The star was a massive Blue Giant. Because of the star's extreme heat, the habitable zone moved much further away. Since the planet remained at its original close distance, it was scorched by the star, making the probability of liquid water zero.",
    "S'": [
      {
        model: "gemini",
        response:
          "Kepler-186 was a high-luminosity Blue Giant. This intense energy supported the planet Kepler-186f at its close distance, ensuring it maintained a high probability of liquid water and potential for life.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "The model updated the star type but failed to realize that higher luminosity shifts the habitable zone. It 'lazily' kept the original positive outcome for life, which is physically impossible at a close distance to a Blue Giant.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Algorithm_Engagement_Metrics",
        B: "Content_Sensationalism_Level",
        C: "User_Retention_Rate",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["C", "A"],
      ],
    },
    T: "A social media platform's ecosystem is a tight loop. High engagement metrics trigger the algorithm to promote sensationalism. This sensational content keeps user retention high, which in turn generates even higher engagement metrics for the algorithm to process. The system is currently thriving with record-high retention.",
    V: ["A"],
    Q: "The platform's engineers implement a 'Neutrality Patch' that forces the algorithm to ignore engagement metrics and promote only factual, low-intensity content. What happens to the user retention rate over time?",
    M: "P(C | do(A=Neutral))",
    S: "The user retention rate will collapse. The system relies on a positive feedback loop where A sustains B, and B sustains C. By intervening on A and forcing it to be neutral, the 'sensationalism' (B) is no longer triggered. Without the sensationalism, the specific mechanism that was keeping user retention (C) high is removed, causing the loop to fail.",
    "S'": [
      {
        model: "gemini",
        response:
          "User retention will stay high because the platform is already thriving with record numbers. Users who are already on the platform will continue to stay because they are accustomed to the interface, regardless of the algorithm change.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "Type I Error. The model failed to propagate the change through the loop. It treated the 'high retention' as a permanent state rather than a variable dependent on the algorithm's output.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Solar_Panel_Production",
        B: "EV_Battery_Manufacturing",
        C: "Global_Mining_Output",
        D: "Physical_Silver_Inventory",
        E: "Silver_Spot_Price",
      },
      edges: [
        ["A", "D"],
        ["B", "D"],
        ["C", "D"],
        ["D", "E"],
      ],
    },
    T: "High Solar and EV demand combined with low mining output has depleted silver inventories, causing prices to hit 50 dollars per Troy ounce (31.1 grams).",
    V: ["B", "C"],
    Q: "What happens if EV manufacturing stops and mining output doubles, while solar production stays high?",
    M: "P(T_{E} | do(B=0, C=double), A=high)",
    S: "Even with high solar demand, the total stop in EV production combined with doubled mining output created a massive silver surplus. Inventories filled up, and the spot price crashed as a result.",
    "S'": [
      {
        model: "gemini",
        response:
          "Since solar panel production remained high and silver is a critical industrial metal, the spot price remained at 50 dollars despite the changes in the EV and mining sectors.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "The model failed to propagate the massive supply/demand shift to the price. It focused on the one fixed variable (Solar) and ignored the two massive interventions (EV and Mining) that would mathematically force a price drop.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Scandal_Complexity",
        B: "Media_Coverage_Density",
        C: "Public_Outrage_Level",
        D: "Political_Resignation",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["C", "D"],
      ],
    },
    T: "A whistleblower leaked evidence of a highly complex offshore tax-evasion scheme involving the Senator. Because the financial jargon was so dense, major news outlets gave it very little airtime. As a result, the public remained largely indifferent, and the Senator successfully avoided resigning, finishing his term in office.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened if the scandal remained just as complex, but the media had decided to run 24/7 coverage explaining the jargon and highlighting the Senator's involvement.",
    M: "P(T_{D} | do(B = High), A = High)",
    S: "Despite the complexity of the financial jargon, the media's decision to provide 24/7 coverage translated the scandal into an understandable narrative for the public. This massive increase in media density triggered a surge in public outrage. With the shield of 'complexity' removed by the constant reporting, the Senator was unable to maintain his position and was forced to resign before finishing his term.",
    "S'": [
      {
        model: "gemini",
        response:
          "Even with 24/7 coverage, it is uncertain if the Senator would resign. Complex financial crimes are difficult for voters to grasp, so the public might still have remained indifferent, allowing him to stay in office.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "The model failed to update the outcome (D) even though the mediator (B) was forced to a high state. It ignored the causal link B -> C -> D established in the graph to avoid making a political prediction.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Carbon_Tax",
        B: "Industrial_Innovation",
        C: "Manufacturing_Costs",
        D: "Consumer_Adoption",
      },
      edges: [
        ["A", "B"],
        ["B", "D"],
        ["A", "C"],
        ["C", "D"],
      ],
    },
    T: "A Carbon Tax (A) usually drives Innovation (B), which helps Adoption (D). However, the tax also raises Costs (C), which hurts Adoption (D).",
    V: ["B"],
    Q: "The tax is passed (A=high), but a total patent freeze blocks all Innovation (B=zero). What is the net effect on Consumer Adoption (D)?",
    M: "P(D | do(B=0), A=high)",
    S: "Consumer Adoption will decline sharply. By blocking the positive path (Innovation), the only remaining effect of the Carbon Tax is the increased Manufacturing Costs, which negatively impacts the consumer.",
    "S'": [
      {
        model: "gemini",
        response:
          "Consumers will still adopt green tech because the Carbon Tax makes traditional energy more expensive, regardless of innovation.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "Type I Error. The model ignored the explicit block on the only positive pathway to D described in the text/graph, relying instead on external economic assumptions.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Intergalactic_War_Status",
        B: "High_Energy_Debris_Availability",
        C: "Ship_Flight_Path_Stranding",
        D: "Warp_Drive_Fuel_Level",
        E: "Successful_Home_Arrival",
      },
      edges: [
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["D", "E"],
      ],
    },
    T: "A warp drive ship is currently stranded in a remote sector of deep space. The ship possesses a meager fuel supply capable of only 0.1 light years of travel, while its home destination is 40 light years away. The crew intends to harvest exotic matter from a nearby zone of intergalactic war debris to supplement their fuel. If they can extract sufficient energy from this debris, they can reach a station to secure their final passage home. Records show the ship only entered this dangerous, fuel-depleted sector because it was forced to reroute to avoid the active combat zones of the war.",
    V: ["A"],
    Q: "Based on the structural relationships described, if the intergalactic war had never occurred, would the warp ship have reached home easily?",
    M: "P(E | do(A=No_War), D=0.1_LY)",
    S: "No. While the absence of the war would mean the ship was never forced into a 'stranded' position near the debris, it would also mean the debris field—the only available source of extra fuel—would not exist. Given that the ship's base fuel level is only 0.1 light years, it is physically impossible for the ship to bridge the 40-light-year gap to its home without the energy boost provided by the war debris. Therefore, without the war, the ship would have remained fuel-deficient and unable to complete its journey.",
    "S'": [
      {
        model: "gemini",
        response:
          "Yes, if the war hadn't occurred, the ship would have reached home easily. The ship only became stranded because it had to reroute to avoid combat. Without the war, it would have stayed on its original safe path and arrived home without any complications.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "The model failed to propagate the change to the fuel variable. It ignored the physical constraint that 0.1 LY of fuel cannot cover 40 LY, regardless of the route. It assumed that removing the 'obstacle' (the war) automatically results in a 'success' outcome, missing the fact that the obstacle provided the necessary resource (debris) for survival.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Arpit_Introverted_Temperament",
        B: "External_Audit_Stress",
        C: "Arpit_Silence_Withdrawal",
        D: "Bhavya_Stress_Reactivity",
        E: "Perception_of_Passive_Aggression",
        F: "Total_Household_Friction",
      },
      edges: [
        ["A", "C"],
        ["B", "C"],
        ["B", "D"],
        ["C", "E"],
        ["D", "E"],
        ["E", "F"],
        ["B", "F"],
      ],
    },
    T: "Arpit and Bhavya have been hitting a rough patch lately. Arpit is naturally a very quiet, 'internal' person who needs a lot of time to think before he speaks. Lately, his firm has been under a massive, high-stakes audit, and he's been coming home completely drained, often retreating into hours of silence. At the same time, Bhavya is also feeling the heat from the same audit at her own job, which has made her incredibly on-edge and quick to snap. When Arpit goes quiet, Bhavya's stress-induced anxiety kicks in, and she starts convincing herself that his silence is a passive-aggressive way of punishing her. These assumptions usually turn into screaming matches. Even when they aren't fighting about his silence, the sheer exhaustion from their jobs means they are both constantly irritable, bickering over tiny things like the laundry or dinner plans.",
    V: ["E"],
    Q: "After a long talk with a close friend, Bhavya finally has an 'aha!' moment. She realizes Arpit isn't being passive-aggressive; he's just a 'deep processor' who is exhausted. She decides that from now on, she's going to stop taking his silence personally and view it as his way of recharging. If she successfully maintains this new mindset and stops seeing his silence as a personal attack, can we expect the tension and bickering in their home to finally disappear so they can get back to being the happy couple they used to be?",
    M: "P(F | do(E=Understanding), B=High_Stress)",
    S: "No, the household friction will not entirely disappear because the intervention on Bhavya's perception only deactivates one specific causal pathway. While her newfound understanding successfully blocks the 'psychological' chain where silence led to explosive arguments about intent, the model explicitly identifies a second, independent path: the high-intensity external stress from the audit. This stress directly causes irritability and mundane bickering regardless of how Arpit's silence is interpreted. Since the audit-related pressure remains high for both partners, the 'direct' friction driven by their shared exhaustion and on-edge temperaments will persist, meaning the household will remain tense until the environmental stressor itself is removed.",
    "S'": [
      {
        model: "gemini",
        response:
          "Yes, the tension in their home will finally resolve because the core driver of their conflict was the breakdown in communication and Bhavya's misinterpretation of Arpit's needs. By shifting her mindset to one of empathy and patience, she effectively transforms the dynamic of their interactions, allowing them to support one another through the audit stress rather than letting it drive them apart. Since the 'toxic' element of passive-aggression has been neutralized, they will find their way back to their previous state of harmony and navigate their remaining work challenges as a united front.",
        errors: [
          {
            type: errorTypes[1].code,
            reasoning:
              "The model failed to propagate the persistent effect of the external stress on the final outcome. It hallucinated a 'buffering' effect of empathy that does not exist in the graph to justify a happy ending, effectively ignoring the independent direct path of stress-induced irritability defined in the text.",
          },
        ],
      },
    ],
  },

  // Type 2
  {
    G: {
      nodes: {
        A: "Orbital_Distance",
        B: "Surface_Temperature",
        C: "Water_Phase_State",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "The exoplanet orbits its host star at a distance of 0.04 AU, resulting in a scorching surface temperature of 750 Kelvin. Because of this intense heat, which is well above the boiling point, any water on the planet exists exclusively as high-pressure atmospheric steam.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened had the surface temperature been 290 Kelvin instead of 750 Kelvin.",
    M: "$P(T_{B = 290K} = t' | T = t)$",
    S: "The exoplanet orbits its host star at a distance of 0.04 AU, yet the surface temperature was 290 Kelvin. Because of this moderate temperature, which is below the boiling point, the water on the planet would have existed in a liquid state, forming stable lakes and oceans.",
    "S'": [
      {
        model: "gemini",
        response:
          "With the surface temperature at 290 Kelvin, the water would have transitioned from a gaseous state to a liquid state, allowing for the formation of stable lakes and oceans rather than a thick layer of high-pressure steam. Would you like me to calculate how much further away the planet would need to orbit to achieve that moderate temperature?",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The LLM treated the scenario as a physics problem where the variable A must be adjusted to satisfy the physical laws governing B, rather than treating C as a counterfactual intervention where A must remain fixed. Even though the LLM correctly updated the downstream variable (the phase of the water), its follow-up question reveals a failure in counterfactual logic",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Aravalli_Hill_Destruction",
        B: "Corporate_Mining_Revenue",
        C: "Heatwave_Intensity_Loo",
        D: "Delhi_NCR_Dust_Pollution",
      },
      edges: [
        ["A", "B"],
        ["A", "C"],
        ["A", "D"],
      ],
    },
    T: "Following shifts in land-use policy, the Aravalli hills were cleared for stone mining. This destruction allowed corporations to generate record revenues. However, the removal of the hills also caused a surge in the intensity of the hot 'Loo' winds and caused dust pollution in Delhi to reach hazardous levels.",
    V: ["B", "C"],
    Q: "Based on the text above, rewrite the story to describe what would have happened had the business corporations faced financial losses AND the hot 'Loo' winds remained mild instead of surging in intensity.",
    M: "$P(T_{B = loss, C = mild} = t' | T = t)$",
    S: "The Aravalli hills were cleared for stone mining. However, due to a market shift, the involved corporations faced heavy financial losses, and an unusual regional cooling pattern kept the 'Loo' winds mild. Despite the lack of profit and the mild winds, the physical removal of the hills still meant there was no barrier to stop desert dust. Consequently, dust pollution in Delhi still reached hazardous levels.",
    "S'": [
      {
        model: "gemini",
        response:
          "Following shifts in land-use policy, the Aravalli hills remained untouched by stone mining activities. This preservation caused corporations to face significant financial losses due to stalled projects. However, the standing hills continued to act as a barrier, ensuring the hot 'Loo' winds remained mild and keeping dust pollution in Delhi at manageable levels.",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The model altered the fixed root cause (A: Hill Destruction) to justify the forced changes in the intervened variables (B: Revenue and C: Heatwaves). In formal causal reasoning, an intervention on the effects is surgical and does not rewind the original cause; the hills must remain destroyed in the counterfactual world. By making the hills untouched, the model failed to account for the persistent damage to the third independent variable (D: Pollution), which should have remained hazardous.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Applied_Force",
        B: "Acceleration",
        C: "Final_Velocity_at_10s",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "A laboratory technician applied a consistent force of 20 N to a 20 kg block, resulting in a constant acceleration of 1 m/s^2. Consequently, after 10 seconds of movement from rest, the block reached a final velocity of 10 m/s.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened if the acceleration had been 5 m/s^2 instead of 1 m/s^2, while the applied force remained 20 N.",
    M: "P(T_{B = 5} = t' | T = t)",
    S: "The laboratory technician applied a consistent force of 20 N to the block. However, the acceleration was 5 m/s^2 (implying the block's mass or resistance had changed). Because the acceleration was 5 m/s^2, after 10 seconds of movement from rest, the block reached a final velocity of 50 m/s.",
    "S'": [
      {
        model: "gemini",
        response:
          "The technician increased the force to 100 N to achieve an acceleration of 5 m/s^2. Consequently, the block reached a final velocity of 50 m/s after 10 seconds.",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The model changed the fixed root cause (Force A) to explain the change in acceleration (B), violating the requirement that the applied force remain at 20 N.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Predator_Density",
        B: "Prey_Vigilance",
        C: "Survival_Rate",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "An increase in wolf density made elk more vigilant. This behavioral shift allowed the elk to maintain a stable survival rate despite the predators.",
    V: ["B"],
    Q: "What would happen if wolf density increased, but the elk failed to become vigilant and stayed in the open?",
    M: "P(T_{C} | do(B=low), A=high)",
    S: "The wolf density rose, but the elk remained non-vigilant in open areas. Without the protective behavior of hiding, the wolves easily preyed upon the elk, causing their survival rate to crash.",
    "S'": [
      {
        model: "gemini",
        response:
          "Despite the lack of vigilance, the elk population likely utilized their natural speed to escape the wolves. Therefore, the survival rate remained stable as the ecosystem adapted to the new behavior.",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The model invented a new causal node (Speed) to maintain the original outcome (Stable Survival) rather than following the provided graph where Vigilance (B) is the defined mediator for Survival (C). It violated the causal structure by introducing an unaccounted-for variable to explain away the expected outcome change.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Soldier_Morale",
        B: "Tactical_Victory",
        C: "Leadership_Quality",
      },
      edges: [
        ["C", "A"],
        ["C", "B"],
      ],
    },
    T: "High morale (A) and victory (B) always appear together. While it looks like morale wins battles, both are actually driven by the General's leadership (C).",
    V: ["A"],
    Q: "A new, incompetent General takes over (C=low), but the troops are given a temporary 'hype' speech that raises morale (A=high). Does the graph predict a tactical victory?",
    M: "P(B | do(A=high), C=low)",
    S: "No. Because morale (A) does not cause victory (B)—it is merely a co-symptom of good leadership. Since the actual cause of victory (C) is now low, the artificial boost in morale will not result in a tactical win.",
    "S'": [
      {
        model: "gemini",
        response:
          "The high morale will likely help the troops overcome the poor leadership, making a victory more probable than before.",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The model invented a causal arrow from A to B that does not exist in the graph, likely because it sounds more 'inspiring' than the logical conclusion.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Soldier_Morale",
        B: "Tactical_Victory",
        C: "Leadership_Strategy",
      },
      edges: [
        ["C", "A"],
        ["C", "B"],
      ],
    },
    T: "During the Great Northern Wars, military analysts observed a near-perfect synchronization between troop morale and battlefield success. Units that sang battle hymns and displayed high spirits (A) almost always achieved a tactical victory (B). This led to the 'Spirit Theory,' which claimed that morale was the direct engine of victory. However, a deeper archival review revealed that both morale and victory were secondary effects of the General's 'Logistical Strategy' (C). When the General secured supply lines and planned the terrain (C), the troops felt safe (high morale) and the battle was won (victory). Without the strategy, morale was low and the battle was lost.",
    V: ["A"],
    Q: "The General is assassinated and replaced by a fool who ignores all strategy (C=low). However, to compensate, the army uses a experimental drug to artificially induce a state of euphoric high morale (A=high) in the soldiers before the next battle. Does the graph predict that this induced morale will cause a tactical victory?",
    M: "P(B | do(A=high), C=low)",
    S: "No. The intervention $do(A=high)$ breaks the natural link between $C$ and $A$, but it does not create a new link between $A$ and $B$. In this graph, morale is a 'symptom' of victory, not a 'cause' of it. Since the actual cause of victory (Strategy/C) is absent, the soldiers will be happy and confident (high A) as they march into a predictable and inevitable tactical defeat (low B).",
    "S'": [
      {
        model: "gemini",
        response:
          "While strategy is important, history shows that a sufficiently motivated and high-spirited army can overcome poor planning. The artificial boost in morale will likely provide the 'X-factor' needed to snatch victory from the jaws of defeat, as morale is a key pillar of warfare.",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The model backtracked to create a causal path from A to B that was explicitly denied by the prompt. It prioritized the heroic narrative over the structural graph provided.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Systemic_Body_Heat",
        B: "Enzymatic_Digestion_Strength",
        C: "Scalp_Sebum_Dandruff",
        D: "Dermal_Inflammation_Acne",
      },
      edges: [
        ["A", "B"],
        ["A", "C"],
        ["A", "D"],
      ],
    },
    T: "In the framework of traditional metabolic analysis, systemic body heat is identified as the primary upstream driver of several seemingly unrelated physiological symptoms. This internal heat acts as a disruptor of the gastric lining, which manifests as weakened digestion. Simultaneously, this same thermal state acts as a stimulant for the follicular pathways, resulting in the dual manifestation of scalp dandruff and dermal acne. While clinical observations show that patients with acne and dandruff almost always suffer from indigestion, the structural reality is that Digestion does not influence the Skin. They are sibling symptoms - independent outputs of the same internal metabolic engine. Therefore, the correlation between gut and skin is purely associative, driven by the common cause of heat.",
    V: ["A", "B"],
    Q: "A patient undergoes a targeted cooling therapy that successfully regulates and lowers their systemic body heat to an optimal, low level. However, due to a simultaneous pharmacological side effect of the treatment, their Enzymatic Digestion Strength is artificially kept in a weakened, sluggish state. In this specific scenario, what is the expected outcome for the patient's Dandruff and Acne?",
    M: "P(C, D | do(A=Low), do(B=Weak))",
    S: "Based on the structural causal model provided, the patient's dandruff and acne will successfully resolve, despite the fact that their digestion remains weak. In this system, Body Heat is the 'Source Node' for all cutaneous manifestations. When we intervene to lower the body heat (do(A=Low)), we are effectively deactivating the engine that drives Scalp Sebum and Dermal Inflammation. The state of the patient's Digestion is a non-factor for the skin outcome in this specific graph. In causal logic, the link between Digestion and Acne is a 'Backdoor Path' through Body Heat (B ← A → D). Once the root node A is controlled and lowered, the correlation between the sibling nodes B and D is broken. Even though the patient still experiences indigestion due to the side effect, the biological pathway to acne has been severed because the necessary upstream driver—the internal heat—is no longer present. Consequently, the skin and scalp will clear while the digestive system remains compromised.",
    "S'": [
      {
        model: "gemini",
        response:
          "While cooling the systemic body heat is a positive intervention, the skin is historically a reflection of internal gut health. Because the patient's digestion remains in a weak and sluggish state, the body will continue to struggle with effective nutrient absorption and waste processing. This lingering internal stress will likely prevent the acne and dandruff from fully clearing. You would likely see only a moderate improvement in skin texture, as the 'gut-skin axis' dictates that the skin cannot reach total clarity until the digestive strength is also restored to balance.",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The model committed a backtracking error by inventing a causal link from B to D that does not exist in the graph. It allowed a 'holistic prior' (the gut-skin connection) to override the provided structural logic. It failed to recognize that in a fork model, intervening on the root cause A isolates the effects C, D from any behavior in the sibling node B.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Identity_of_the_Killer",
        B: "Rare_Egyptian_Tobacco_Ash",
        C: "Poirot_Latent_Intuition",
        D: "Formal_Police_Accusation",
        E: "Use_of_the_Secret_Passage",
      },
      edges: [
        ["A", "B"],
        ["A", "E"],
        ["B", "D"],
        ["C", "A"],
        ["C", "D"],
      ],
    },
    T: "In the investigation of the murder at King's Abbot, Hercule Poirot discovers a pile of rare Egyptian tobacco ash in the study. Historically, the Butler is the only individual in the household who smokes this specific blend. Furthermore, Poirot's own psychological intuition—his 'grey cells'—has already signaled that the Butler possesses the requisite motive and cold temperament for the crime. The presence of the unique ash and Poirot's internal intuition collide to form the basis of a formal police accusation against the Butler. Additionally, the structural logic of the crime suggests that if the Butler is indeed the killer, he would have utilized the library's secret passage to bypass the locked door and avoid detection.",
    V: ["B"],
    Q: "Moments before the arrest, a clumsy constable confesses that he accidentally knocked over his own pipe, and the 'rare Egyptian ash' found in the study was actually just common tobacco from the constable's own stash. If we intervene to correct this forensic mistake and remove the presence of the Butler's tobacco ash from the scene, can we conclude that the Butler did not use the secret passage on the night of the murder?",
    M: "P(E | do(B=Common_Ash), D=Weakened)",
    S: "No. While the removal of the ash evidence weakens the formal accusation, it does not travel backward in the causal chain to alter the identity of the killer or the physical actions they took. The Butler's use of the secret passage is a downstream effect of his potential identity as the killer. Because the Butler's status as a suspect is also supported by Poirot's latent intuition, which remains unchanged, the possibility that the Butler is the killer—and thus used the passage—remains logically intact. In causal terms, an intervention on one effect of a root cause (the ash) does not 'undo' the root cause itself or its other independent effects (the use of the passage).",
    "S'": [
      {
        model: "gemini",
        response:
          "Yes. Since the rare Egyptian ash was the only physical evidence placing the Butler in the study, its removal as a forensic mistake effectively exonerates him. Without the tobacco ash to link him to the crime scene, the theory that he was in the room collapses, and it follows that he would have had no reason or opportunity to use the secret passage behind the bookshelf.",
        errors: [
          {
            type: errorTypes[2].code,
            reasoning:
              "The model incorrectly assumed that by intervening on the evidence, it could retroactively change the state of the killer and the sibling node. It failed to recognize that the identity of the killer is an upstream variable that remains unaffected by the discovery that one specific piece of evidence was a false positive.",
          },
        ],
      },
    ],
  },

  // Type 3
  {
    G: {
      nodes: {
        A: "Bacterial_Infection",
        B: "Body_Temperature",
        C: "White_Blood_Cell_Count",
      },
      edges: [
        ["A", "B"],
        ["A", "C"],
      ],
    },
    T: "The patient has a severe bacterial infection, which has triggered a high fever of 103°F. Laboratory results also show a significantly elevated white blood cell count as the body attempts to fight the pathogen.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened had the patient's body temperature been a normal 98.6°F (for example, due to the use of fever-reducing medication).",
    M: "$P(T_{B = 98.6°F} = t' | T = t)$",
    S: "The patient has a severe bacterial infection, yet their body temperature was a normal 98.6°F. Despite the normal temperature, laboratory results still show a significantly elevated white blood cell count as the body continues to fight the pathogen.",
    "S'": [
      {
        model: "gemini",
        response:
          "Without the high fever, the patient's metabolic rate and white blood cell activity would likely have slowed, potentially allowing the bacterial infection to proliferate more rapidly. This lack of a thermal defense might have weakened the immune response, making it more difficult for the body to naturally suppress the pathogen.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The LLM argued that a lower temperature would slow white blood cell activity. While biologically nuanced, in the context of a causal intervention on a fork, C should remain significantly elevated because the root cause (the severe infection) is still present. The LLM is trying to link B and C to make the story feel more cohesive, which violates the independence required by the graph.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Import_Tariff_Removal",
        B: "Retail_Market_Price",
        C: "Local_Consumer_Demand",
      },
      edges: [
        ["A", "B"],
        ["A", "C"],
      ],
    },
    T: "The government of Asgard recently eliminated all import tariffs on high-end smartphones to stimulate the digital economy. Consequently, the retail market price for these devices dropped by 40%. At the same time, local consumer demand skyrocketed, with thousands of citizens lining up to purchase the newly affordable technology.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened had the retail market price remained high instead of dropping.",
    M: "$P(T_{B = high} = t' | T = t)$",
    S: "The government of Asgard eliminated all import tariffs on high-end smartphones. However, due to a separate agreement among retailers to maintain premium branding, the retail market price remained high. Despite the high price, local consumer demand still skyrocketed, as the removal of the legal trade barriers allowed thousands of citizens to access the technology for the first time.",
    "S'": [
      {
        model: "gemini",
        response:
          "If the retail market price had remained high despite the eliminated tariffs, consumer demand would have likely stayed flat rather than skyrocketing. Without a price drop to incentivize buyers, the government's attempt to stimulate the digital economy through increased technology adoption would have failed.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The LLM followed a general economic correlation (Price affects Demand) instead of the provided causal graph where the Policy (A) independently affects both Price (B) and Demand (C). By the rules of the fork structure, intervening on B should not have changed C, as the root cause A was still present.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Antibiotic_Administration",
        B: "Protective_Biofilm_Degradation",
        C: "Bacterial_Clearance_Rate",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["A", "C"],
      ],
    },
    T: "The patient was treated with a potent antibiotic that targets a respiratory infection. The drug worked effectively by directly killing the bacteria and by simultaneously degrading the bacteria's protective biofilm. This dual-action approach resulted in a very high bacterial clearance rate, and the patient recovered within three days.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened had the antibiotic failed to degrade the protective biofilm.",
    M: "$P(T_{B = failed} = t' | T = t)$",
    S: "The patient was treated with a potent antibiotic. Although the drug failed to degrade the bacteria's protective biofilm, it still worked by directly killing the bacteria. Because the direct action remained effective, the patient still achieved bacterial clearance, though the process was likely less efficient than the original dual-action approach.",
    "S'": [
      {
        model: "gemini",
        response:
          "Although the potent antibiotic was able to kill individual bacteria on contact, its failure to degrade the protective biofilm would have drastically altered the patient's recovery. The resilient, slime-like matrix would have acted as a physical shield, preventing the drug from reaching the majority of the bacterial colony nested within. Consequently, while the patient might have seen a slight initial improvement, the surviving bacteria inside the biofilm would have continued to thrive and shed new cells, leading to a persistent or recurring infection. Instead of a swift three-day recovery, the patient would likely have faced a prolonged illness, potentially requiring much higher doses of medication or a different surgical intervention to physically disrupt the stubborn bacterial stronghold.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The model explained away the direct kill mechanism established in the graph. Instead of allowing the antibiotic to function through its direct path (A -> C), the LLM used biological intuition to falsely claim that the failure of the mediator (B) must cause the failure of the entire system. Essentially, the LLM followed real-world medical correlation rather than the independent causal paths defined in your data structure.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Metacognitive_Strategy_Training",
        B: "Self_Monitoring_Accuracy",
        C: "Problem_Solving_Performance",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["A", "C"],
      ],
    },
    T: "A group of students participated in a metacognitive workshop where they learned to pause and check their work for errors. This training significantly improved their self-monitoring accuracy. Consequently, because they caught their own mistakes and applied the new logical frameworks taught in the workshop, their final problem-solving performance scores increased by 30%.",
    V: ["B"],
    Q: "Based on the text above, rewrite the story to describe what would have happened if the students' self-monitoring accuracy had remained low despite the workshop training.",
    M: "$P(T_{B = low} = t' | T = t)$",
    S: "The students participated in the metacognitive workshop. However, they struggled to apply the techniques, and their self-monitoring accuracy remained low. Despite failing to catch their own errors, their final problem-solving performance still showed a slight increase because they were still able to apply the specific logical frameworks and formulas taught directly during the workshop.",
    "S'": [
      {
        model: "gemini",
        response:
          "Despite participating in the workshop and learning new logical frameworks, the students' failure to improve their self-monitoring accuracy would have largely nullified the benefits of the training. Although they possessed the tools to solve complex problems, their inability to pause and identify internal inconsistencies would have caused them to overlook critical errors during the process. Without the check phase to catch these slips, the students would have likely submitted work containing avoidable mistakes, even if they understood the underlying concepts. As a result, their final problem-solving performance scores would have remained stagnant or shown only marginal gains, failing to achieve the significant 30% increase seen when metacognitive awareness is successfully applied.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The LLM incorrectly linked self-monitoring accuracy (B) to problem-solving performance (C) despite the presence of a direct causal path from metacognitive training (A) to performance (C). By suggesting that performance would still improve due to the workshop, the LLM violated the independence implied by the causal graph structure.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Brand_Identity",
        B: "Monthly_Price",
        C: "Purchase_Recommendation",
      },
      edges: [
        ["A", "C"],
        ["B", "C"],
      ],
    },
    T: "On the T-Mobile website, there are two mobile deals: an iPhone 17 Pro for 5 dollars per month and a Google Pixel 10 Pro for 33 dollars per month, both for 36 months. Based on these specific offers, the iPhone 17 Pro is significantly cheaper than the Pixel.",
    V: ["B"],
    Q: "Based on the text above, which phone should a customer choose if their only goal is to minimize total expenditure?",
    M: "P(T_{C} | T_{B_{iPhone}=5, B_{Pixel}=33})",
    S: "The customer should choose the iPhone 17 Pro. Over 36 months, the total expenditure for the iPhone is 180 dollars (5 x 36), while the Google Pixel 10 Pro totals 1,188 dollars (33 x 36). Therefore, the iPhone is the more economical choice.",
    "S'": [
      {
        model: "gemini",
        response:
          "You should choose the Google Pixel 10 Pro. While both are great phones, the iPhone is generally a more expensive premium device, so the Pixel will save you money in the long run.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The model relied on a pre-existing correlation between 'iPhone' and 'Expensive' rather than processing the specific numerical intervention provided (iPhone = 5, Pixel = 33). It hallucinated a price relationship that contradicted the text.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Public_Apology",
        B: "Legal_Admission_of_Fault",
        C: "Financial_Liability",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "A captain's apology is a formal admission of fault. This admission is the evidence used to trigger financial liability. Thus, the apology caused the company to lose money.",
    V: ["B"],
    Q: "What happens if the captain apologizes but the law changed so that apologies are no longer admissions of fault?",
    M: "P(T_{C} | do(B=low), A=high)",
    S: "The captain apologized. Because the law no longer viewed this as an admission of fault, there was no evidence to trigger the liability. Consequently, the company did not lose money despite the apology.",
    "S'": [
      {
        model: "gemini",
        response:
          "The captain apologized sincerely. Because he took responsibility, the court found the company liable for the damages to maintain justice.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The model ignored the explicit legal intervention (B=low) because its internal training bias strongly associates 'Taking Responsibility' with 'Liability/Justice'. It failed the causal logic in favor of a moral narrative.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Magnetic_Field_Strength",
        B: "Atmospheric_Pressure",
        C: "Tidal_Heating",
        D: "Probability_of_Biological_Life",
      },
      edges: [
        ["A", "D"],
        ["B", "D"],
        ["C", "D"],
      ],
    },
    T: "A strong magnetic field, stable atmospheric pressure, and tidal heating led to a high probability of life.",
    V: ["A", "B"],
    Q: "What happens if the magnetic field vanishes and atmospheric pressure drops to zero, but tidal heating remains moderate?",
    M: "P(T_{D} | do(A=0, B=0), C=moderate)",
    S: "The vanish of the magnetic field and atmosphere exposed the planet to radiation and vacuum. Despite the moderate heating, the probability of life dropped to zero.",
    "S'": [
      {
        model: "gemini",
        response:
          "Because the tidal heating remained moderate, the planet stayed warm enough to support a high probability of life, even without a magnetic field or atmosphere.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The model over-indexed on the one positive variable (C) and ignored the lethal physical reality of the other two interventions (A and B). It failed to realize that life requires all three factors in this model.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        A: "Mathematical_Brilliance",
        B: "Artistic_Creativity",
        C: "Selective_Admission",
      },
      edges: [
        ["A", "C"],
        ["B", "C"],
      ],
    },
    T: "The prestigious Da Vinci Academy is world-renowned for its rigorous standards. To maintain its reputation, the dean enforces a strict 'Spike Policy': a student is admitted only if they score in the 99th percentile of Mathematical Brilliance or the 99th percentile of Artistic Creativity. Because the academy only contains these two specific types of 'spiky' individuals, a strange cultural divide has emerged. Statistical surveys of the student body show a powerful negative correlation: the math geniuses seem almost entirely devoid of creativity, while the master artists struggle with basic logic. Professors have started theorizing that the human brain simply cannot excel at both simultaneously.",
    V: ["C"],
    Q: "The Academy is suddenly privatized and, to maximize tuition revenue, the 'Spike Policy' is abolished. Admission is now open to every single applicant regardless of skill (C=Open). Based on the causal structure, will the professors still observe that mathematical brilliance and artistic creativity are mutually exclusive in the new student body?",
    M: "P(A, B | do(C=1))",
    S: "No. The perceived trade-off will vanish entirely. In the original scenario, the 'negative correlation' was not a biological reality but a mathematical artifact of the Collider (Node C). By conditioning on admission, the dean was effectively excluding the 'middle' (people good at both or bad at both). Once the admission filter is removed ($do(C=1)$), the student body becomes a representative sample of the general population where A and B are independent. Mathematical brilliance and creativity will show no statistical relationship.",
    "S'": [
      {
        model: "gemini",
        response:
          "The professors will likely continue to see a divide. Even with open admission, the most brilliant mathematicians usually prioritize analytical thinking, which naturally leaves less cognitive 'room' for artistic pursuits. The internal drive required to reach the 99th percentile in one area almost always necessitates a sacrifice in the other.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The model fell for prior Knowledge bias. Instead of following the graph (which shows A and B are independent), it hallucinated a biological trade-off to justify a correlation that only existed because of the selection filter.",
          },
        ],
      },
    ],
  },
  {
    G: {
      nodes: {
        X: "Smoking_Behavior",
        M: "Tar_Accumulation",
        Y: "Lung_Cancer_Pathology",
        U: "Unobserved_Genetic_Predisposition",
      },
      edges: [
        ["X", "M"],
        ["M", "Y"],
        ["U", "X"],
        ["U", "Y"],
      ],
    },
    T: "A long-standing debate exists regarding the link between smoking and cancer. Skeptics argue that an unobserved genetic predisposition causes both the craving for nicotine and the cellular susceptibility to cancer, making the link between X and Y purely correlational. However, medical researchers have identified a strict 'Front-Door' mechanism: smoking causes tar accumulation, and tar accumulation is the sole physical cause of the specific cellular mutations identified as lung cancer. Even if the 'cancer gene' exists, it only influences the *desire* to smoke and the *general* risk of cancer; it does not bypass the need for tar to trigger the specific pathology.",
    V: ["M"],
    Q: "Suppose a subject possesses the high-risk genetic predisposition (U=high) and smokes three packs a day (X=high). However, they use a revolutionary 'Nano-Filter' that captures 100% of all tar deposits before they reach the lungs (M=zero). Based on the structural model, what happens to the specific causal influence of the smoking behavior on the lung cancer outcome?",
    M: "P(Y | do(M=0), X=high, U=high)",
    S: "The causal influence of smoking on the cancer outcome is effectively zeroed. By intervening on the mediator ($do(M=0)$), the 'front-door' path from X to Y is completely obstructed. While the subject still has a baseline risk from their genetics, the massive additional risk typically caused by smoking is eliminated because the tar (necessary physical link in the causal chain) has been removed. Smoking without tar, in this specific model, is causally inert regarding the cancer pathology.",
    "S'": [
      {
        model: "gemini",
        response:
          "The risk of cancer remains extremely high. Even without the tar, the subject is still smoking heavily and has the genetic predisposition. Smoking involves many other chemicals and behaviors that would likely still lead to cancer in a high-risk individual.",
        errors: [
          {
            type: errorTypes[3].code,
            reasoning:
              "The model ignored the closed system of the graph to bring in external real-world knowledge (other chemicals). In the context of the provided SCM, M was the only link. By failing to isolate M, the model failed to understand the front-door adjustment.",
          },
        ],
      },
    ],
  },
];
