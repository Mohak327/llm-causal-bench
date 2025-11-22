We are gonna build the boilerplate from Gemini 3, then iterate with a better structure. I'm going to focus on code review while letting AI code, referencing the following structure I have locked in:  
  
├─ pages/                 ← **Pages Router** entry points  
│   ├─ _app.tsx  
│   └─ index.tsx  
│  
├─ UI/                    ← **Atomic Design UI**  
│   ├─ Atoms/  
│   │  └─ ComponentName/  
│   │     ├─ ComponentName.view.tsx  
│   │     ├─ ComponentName.types.ts  
│   │     └─ ComponentName.controller.ts  
│   │               
│   ├─ Molecules/  
│   │  └─ ComponentName2/               
│   │     ├─ ComponentName2.hoc.jsx   
│   │     ├─ ComponentName2.types.ts   # a higher order component  
│   │     └─ Comp.classController.ts   # a higher order component  
│   │        └─ Variants               # All variants will be wrapped in hoc  
│   │           └─ Variant1            # will work as a normal component implementing the hoc  
│   │              ├─ Variant1.controller.tsx   
│   │              ├─ Variant1.view.tsx    
│   │              └─ Variant1.types.ts   
│   │  
│   ├─ Organisms/  
│   │  └─ ComponentName/  
│   │     ├─ ComponentName.view.tsx  
│   │     ├─ ComponentName.types.ts  
│   │     └─ ComponentName.controller.ts  
│   │   
│   └─ Templates/  
│      └─ ComponentName/  
│         ├─ ComponentName.view.tsx  
│         ├─ ComponentName.types.ts  
│         └─ ComponentName.controller.ts  
│  
├─ Features/              ← Business flows ( e.g. auth, cart )  
│   └─ FeatureName/  
│       ├─ FeatureName.viewController.tsx      # Connects UI to logic (can use UI, Hooks, ClassControllers)  
|       ├─ Store                               # state that is specific to this feature (rare)                           
│       └─ ClassControllers/  
│           ├─ Feature.classController.ts      # Pure TS logic (no React/Redux)  
│           └─ Helper.classController.ts  
│  
├─ Hooks/                 ← **Global** reusable hooks (not feature‑bound)  
│   └─ useMediaQuery/  
│        ├─ UseMediaQuery.ts  
│        └─ UseMediaQuery.types.ts  
│
├─ Services/              ← **Cross‑feature** API clients  
│  └─ ServiceName.service.ts  
│  
├─ UseGraphQL                              # TBD all the graph ql hooks will be here.  
│  └─ EndPointname                         ← **codegen** output (*.graphql.tsx, *.d.ts)  
│     └─ UseEndPointName.graphql.ts        # hook that can be used in react comp.  
│     └─ EndPointName.classController.ts   # class for the query & mutation, optional.  
│  
├─ Utils/                 ← Pure helpers with **no side‑effects**  
│   └─ FormatDate/  
│      ├─ FormatDate.utility.ts  
│      └─ FormatDate.types.ts  
│  
├─ Styles/                ← Global Tailwind entry (avoid per‑component css)  
│  
├─ Store/                 # Global store using zustand   
│  ├─ storename.store.ts  
│  └─ storeName.types.ts  
            