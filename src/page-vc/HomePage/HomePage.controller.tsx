"use client";
import { homeData } from "@/page-data/home/home.model";
import HomePageView from "./HomePage.view";
import { skillCategories } from "@/page-data/skills/skills.model";
import { SkillCategoryProps } from "../../page-data/home/home.interface";

const getTechArsenal = (categories: SkillCategoryProps[]) => {
  const skills: string[] = [];
  let totalRemaining = 0;

  categories.forEach((cat) => {
    const firstThree = cat.elements.slice(0, 3).map((el) => el.name);
    skills.push(...firstThree);
    const remainingInCat = Math.max(0, cat.elements.length - 3);
    totalRemaining += remainingInCat;
  });

  if (totalRemaining > 0) {
    skills.push(`+${totalRemaining} more`);
  }

  return {
    ...homeData.techArsenal,
    skills,
  };
};

const HomePageController = () => {
  const techArsenal = getTechArsenal(skillCategories);
  return <HomePageView techArsenal={techArsenal} />;
};

export default HomePageController;
