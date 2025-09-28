export type Tag = {
  id: string;
  name: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  type: string;
  user_id: string;
  tags: Tag[];
};
