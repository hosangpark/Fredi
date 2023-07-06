export type FairListItem = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  price: number;
  size: string;
  weight: string;
  country: string;
  description: string;
  designer: string;
  sns: string;
  email: string;
  website: string;
  created_time: string;
  like_count: number;
  image: TImage[];
  isLike: boolean;
};

export type ArtworkListItem = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  price: number;
  size: string;
  weight: string;
  country: string;
  description: string;
  designer: string;
  sns: string;
  email: string;
  website: string;
  created_time: string;
  like_count: number;
  image: TImage[];
  isLike: boolean;
};

export type TImage = {
  idx: number;
  file_name: string;
  count?:number
};

export type TProducerListItem = {
  idx: number;
  name: string;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  address_text: string;
  zipcode: string;
  address1: string;
  address2: string;
  phone: string;
  business_hour: string;
  sns: string;
  email: string;
  website: string;
  description: string;
  created_time: Date;
  updated_time: Date;
  deleted_time: Date;
  image: TImage[];
  isLike: boolean;
  like_count: number;
};

export type ArtistItem = {
  idx: number;
  name: string;
  designer: string;
};


export type TProductListItem = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  size: string;
  weight: string;
  country: string;
  designer: string;
  sns: string;
  email: string;
  website: string;
  description: string;
  created_time: Date;
  updated_time: Date;
  deleted_time: Date;
  image: TImage[];
  isLike: boolean;
  like_count: number;
};

export type LatestList = [
  
]