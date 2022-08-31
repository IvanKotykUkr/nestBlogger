export type QueryForGetBloggersType = {
  SearchNameTerm: string;
  PageNumber: number;
  PageSize: number;
};
export type BodyForCreateBloggerType = {
  name: string;
  youtubeUrl: string;
};
