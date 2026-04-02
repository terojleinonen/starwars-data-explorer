type Group = {
  title: string;
  fields: string[];
};

export const detailGroups: Record<string, Group[]> = {
  people: [
    {
      title: "Overview",
      fields: ["name", "gender", "birth_year"],
    },
    {
      title: "Physical",
      fields: ["height", "mass", "hair_color", "eye_color"],
    },
  ],

  planets: [
    {
      title: "Overview",
      fields: ["name", "climate", "terrain"],
    },
    {
      title: "Statistics",
      fields: ["population", "gravity", "diameter"],
    },
  ],

  starships: [
    {
      title: "Overview",
      fields: ["name", "model", "manufacturer"],
    },
    {
      title: "Technical",
      fields: ["crew", "passengers", "max_atmosphering_speed"],
    },
  ],

  films: [
    {
      title: "Overview",
      fields: ["title", "director", "producer"],
    },
    {
      title: "Release",
      fields: ["release_date"],
    },
  ],
};