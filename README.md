We are gonna build the boilerplate from Gemini 3, then iterate with a better structure. I'm going to focus more on the content, projects and code review while letting AI code up as per the spec docs I feed it, referencing the following structure I have locked in: 
 
  src/
├─ app/                            # Vite/React entry point
│   ├─ App.tsx                     # Root App, renders Router
│   └─ main.tsx                    # Vite bootstrapper
│
├─ pages/                          # Route-level components ('pages')
│   ├─ Home.tsx
│   ├─ About.tsx
│   ├─ ...                         # Other page components
│
├─ routes/
│   └─ routes.tsx                  # React Router config definitions
│
├─ components/                     # ATOMIC DESIGN SYSTEM
│   ├─ Atoms/
│   │   └─ ComponentName/  
│   │       ├─ ComponentName.view.tsx   
│   │       ├─ ComponentName.types.ts  
│   │       └─ ComponentName.controller.ts  
│   ├─ Molecules/
│   │   └─ ComponentName2/
│   │       ├─ ComponentName2.hoc.tsx
│   │       ├─ ComponentName2.types.ts
│   │       └─ Comp.classController.ts
│   │           └─ Variants/
│   │               └─ Variant1/
│   │                   ├─ Variant1.controller.tsx
│   │                   ├─ Variant1.view.tsx
│   │                   └─ Variant1.types.ts
│   ├─ Organisms/
│   │   └─ ComponentName/
│   │       ├─ ComponentName.view.tsx
│   │       ├─ ComponentName.types.ts
│   │       └─ ComponentName.controller.ts
│   └─ Templates/
│       └─ ComponentName/
│           ├─ ComponentName.view.tsx
│           ├─ ComponentName.types.ts
│           └─ ComponentName.controller.ts
│
├─ features/
│   └─ FeatureName/
│       ├─ FeatureName.viewController.tsx
│       ├─ Store/
│       └─ ClassControllers/
│           ├─ Feature.classController.ts
│           └─ Helper.classController.ts
│
├─ hooks/
│   └─ useMediaQuery/
│       ├─ useMediaQuery.ts
│       └─ useMediaQuery.types.ts
│
├─ services/
│   └─ ServiceName.service.ts
│
├─ useGraphQL/
│   └─ EndPointName/
│       ├─ UseEndPointName.graphql.ts
│       └─ EndPointName.classController.ts
│
├─ utils/
│   └─ FormatDate/
│       ├─ FormatDate.utility.ts
│       └─ FormatDate.types.ts
│
├─ styles/                        # Global Tailwind entry (avoid per-component css)
│   └─ tailwind.config.ts         # Or .js, Tailwind setup
│
├─ store/                         # Global store, Zustand
│   ├─ storeName.store.ts
│   └─ storeName.types.ts
│
├─ assets/                        # Static images/media (optional)
│
└─ index.html                     # Vite template
