We are gonna build the boilerplate from Gemini 3, then iterate with a better structure. I'm going to focus more on the content, projects and code review while letting AI code up as per the spec docs I feed it, referencing the following structure I have locked in: 
 
index.html  
assets/                              # Static images/media (optional)  
src/  
+ ├─ app/                            # Vite/React entry point  
  │   ├─ App.tsx                     # Root App, renders Router  
  │   ├─ main.tsx                    # Vite bootstrapper  
  │   ├─ App.css                    
  │   └─ index.css                   
  │  
+ ├─ pages/                          # Route-level components ('pages')  
  │   ├─ Page1/  
  │   │   ├─ Page1.view.tsx   
  │   │   ├─ Page1.types.ts  
  │   ├─ ...                         # Other page components  
  │  
+ ├─ routes/  
  │   └─ routes.tsx                  # React Router config definitions  
  │  
  ├─ components/                     # ATOMIC DESIGN SYSTEM  
  │   ├─ Atoms/  
  │   │   └─ Atom1/  
  │   │       ├─ Atom1.view.tsx   
  │   │       ├─ Atom1.types.ts  
  │   │       └─ Atom1.controller.ts  
  │   ├─ Molecules/  
  │   │   └─ Molecule1/  
  │   │       ├─ Molecule1.hoc.tsx   
  │   │       ├─ Molecule1.types.ts  
  │   │       └─ Molecule1.classController.ts  
  │   │           └─ Variants/  
  │   │               └─ Variant1/  
  │   │                   ├─ Variant1.controller.tsx  
  │   │                   ├─ Variant1.view.tsx  
  │   │                   └─ Variant1.types.ts  
  │   ├─ Organisms/  
  │   │   └─ Organism1/  
  │   │       ├─ Organism1.view.tsx  
  │   │       ├─ Organism1.types.ts  
  │   │       └─ Organism1.controller.ts  
  │   └─ Templates/  
  │       └─ Template1/  
  │           ├─ Template1.view.tsx  
  │           ├─ Template1.types.ts  
  │           └─ Template1.controller.ts  
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
+ ├─ services/  
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
      ├─ storeName.store.ts  
      └─ storeName.types.ts  
  
