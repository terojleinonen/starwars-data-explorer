import React from "react";
import { useRouter } from "next/router";
import CategoryPage from "../../components/CategoryPage";

const CategoryIndex = ({ theme }: { theme: string }) => {
  const router = useRouter();
  const { category } = router.query;

  return <CategoryPage category={category} theme={theme} />;
};

export default CategoryIndex;