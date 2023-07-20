import { type } from "os";

export type FairDetailsType = {
  idx: number;
  name: string;
  start_dt:string;
  end_dt: string,
  location: string,
  created_time: string,
  updated_time: string | null,
  deleted_time: string | null,
  image: TImage[];
  image_m: TImage[];
  range:string;
  fair_link_data : FairLinkData[]
  artwork_data:FairDetailsArtworkItem[]
  isLike?: boolean;
  designer_data:FairDetailsArtistItem[]
};

export type FairLinkData = {
  idx:number;
  created_time:string;
  fair_idx:number;
  artwork_idx:number;
}

export type FairListItem = {
  idx: number;
  category: string;
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

export type FairList = {
  created_time: string;
  deleted_time?: string | null;
  end_dt: string;
  idx: number;
  image:ImageType[];
  image_m:ImageType[];
  location:string;
  name: string;
  start_dt:string;
  updated_time?:string | null;
};
export type MainFairList = {
  created_time: string;
  deleted_time?: string | null;
  end_dt: string;
  idx: number;
  image:ImageType;
  image_m:ImageType;
  location:string;
  name: string;
  start_dt:string;
  updated_time?:string | null;
};


export type ArtworkItem = {
  idx: number;
  category:string;
  name: string;
  size: string;
  description: string;
  designer_idx:number;
  sns:string;
  email:string;
  created_time: string;
  updated_time: string | null;
  deleted_time: string | null;
  like_count: number;
  width:string;
  depth:string
  height:string;
  materials:string | null;
  link_buy:string | null;
  country: string;
  designer: string;
  price?:number;
  website: string;
  image: ImageType[];
}
export type FairDetailsArtworkItem = {
  idx: number;
  category: string;
  name: string;
  size: string;
  description: string;
  designer_idx:number;
  sns:string;
  email:string;
  created_time: string;
  updated_time: string | null;
  deleted_time: string | null;
  like_count: number;
  width:string;
  depth:string
  height:string;
  materials:string | null;
  link_buy:string | null;
  user: UserType
  country?: string;
  designer?: string;
  imageList: ImageType[];
  imageList_m:ImageType[];
  price?:number;
  isLike?:boolean;
  website?: string;
}

export type FairDetailsArtistItem = {
  idx: number,
  type: number,
  user_id: string,
  password: string,
  name: string,
  nickname: string,
  phone: string,
  gender: number,
  birth: string,
  login_time: string,
  created_time: string,
  suspended_time: string | null,
  deleted_time: string | null,
  reason: string,
  level: number,
  zipcode: string,
  address1: string,
  address2: string,
  following: number,
  followers: number
}
export type ArtistList = {
  idx: number,
  type: number,
  user_id: string,
  password: string,
  name: string,
  nickname: string,
  phone: string,
  gender: number,
  birth: string,
  login_time: string,
  created_time: string,
  suspended_time: string | null,
  deleted_time: string | null,
  reason: string,
  level: number,
  zipcode: string,
  address1: string,
  address2: string,
  following: number,
  followers: number,
  email:string,
  image_idx:number;
  image:TImage
}

export type FeaturedListType = {
  idx: number,
  category: string,
  user_idx: number,
  name: string,
  about: string,
  link_title: string,
  link_url: string,
  created_time: string,
  updated_time: string | null,
  deleted_time: string | null,
  like_count: number,
  read_count: number,
  is_featured: string,
  is_hide: number,
  image: ImageType[],
  isLike: boolean,
  isBookmark: boolean,
  category_arr: number[]
}
export type DesignerType = {
  idx:number;
  type:number;
  user_id:string;
  password:string;
  name:string;
  nickname:string;
  phone:number;
  gender:number;
  birth:string;
  login_time:string;
  created_time:string;
  suspended_time:string | null;
  deleted_time:string | null;
  reason: string;
  level:number;
  zipcode:string;
  address1:string;
  address2:string;
  following:number;
  followers:number;
  email:string | null;
  image_idx:number;
  is_tranding:string;
}
export type ArtworkListItem = {
  idx: number;
  category: string;
  name: string;
  price?: number;
  designer_idx?:number;
  designer_name?:string;
  size: string;
  weight: string;
  country: string;
  description: string;
  designer: DesignerType;
  sns: string;
  email: string;
  website: string;
  created_time: string;
  materials?:string | null;
  link_buy: string | null;
  like_count: number;
  image: TImage[];
  isLike: boolean;
};

export type TImage = {
  idx: number;
  file_name: string;
  count?:number
};
export type ImageType = {
  idx: number;
  file_name: string;
  name:string;
};
export type LinkListType = {
  created_at:string;
  idx: number;
  title: string;
  url:string;
  user_idx:number;
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
  created_time: string;
  updated_time: string | null;
  deleted_time: string | null;
  image: TImage[];
  isLike: boolean;
  like_count: number;
};

export type ArtistItem = {
  idx: number;
  type: number;
  user_id: string;
  password: string;
  name: string;
  nickname: string;
  phone: number;
  gender: number;
  birth: string;
  login_time: string;
  created_time: string;
  suspended_time: Date | null;
  deleted_time: Date | null;
  reason: string;
  level: number;
  zipcode: number;
  address1: string;
  address2: string;
  following: number;
  followers: number;
};

export type UserType = {
  idx: number;
  type: number;
  user_id: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
  gender: number;
  birth: string;
  login_time: string;
  brand_name?:string;
  created_time: string;
  suspended_time: string | null;
  deleted_time: string | null;
  reason: string;
  level: number;
  zipcode: string;
  address1: string;
  address2: string;
  following: number;
  followers: number;
  email:string | null;
  image_idx:number;
  image:TImage;
  isLike:boolean;
  about?:string;
}

export type FollowArtistListType = {
  idx: number,
  created_time: string,
  designer: designerType   
}
export type LikeSnsListType = {
  idx: number,
  created_time: string,
  sns: snsType
}

export type snsType = {
  idx: number,
  category: string,
  user_idx: number,
  name: string,
  about: string,
  link_title: string,
  link_url: string,
  created_time: string,
  updated_time: string | null,
  deleted_time: string | null,
  like_count: number,
  read_count: number,
  is_featured: string,
  is_hide: number,
  image: ImageType[]
}
export type designerType = {
  idx: number,
  type: number,
  user_id: string,
  password: string,
  name: string,
  nickname: string,
  phone: string,
  gender: string,
  birth: number,
  login_time: string,
  created_time: string,
  suspended_time: string | null,
  deleted_time: string | null,
  image:ImageType,
  count:number;
  reason: string,
  level: string,
  zipcode: string,
  address1: string,
  address2: string,
  following: string,
  followers: string
}

export type TProductListItem = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  size: string;
  weight: string;
  country: string;
  designer: string;
  sns: string;
  price?:number;
  email: string;
  website: string;
  description: string;
  created_time: string;
  updated_time: string | null;
  deleted_time: string | null;
  image: TImage[];
  isLike: boolean;
  like_count: number;
};

export type ArtworkLikeListItem = {
  idx: number;
  created_time: string;
  artwork: ArtworkListItem
};

export type LatestList = [
  
]

export type LikeProductListItem = {
  idx: number;
  created_time: string;
  product: TProductListItem;
};

export type LikeProducerListItem = {
  idx: number;
  created_time: string;
  producer: TProducerListItem;
};

export type LikeShopListItem = {
  idx: number;
  created_time: string;
  sale_product: TShopListItem;
};

export type TShopListItem = {
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

export type WeeklyListItem = {
  idx:number;
  name:string;
  month:number;
  weeknum:number;
  week:string;
  created_time: string;
  updated_time: string | null;
  deleted_time: string | null;
  image: TImage[]
}
export type WeeklyDetailsType = {
  idx:number;
  name:string;
  month:number;
  weeknum:number;
  week:string;
  created_time:string;
  updated_time:string | null;
  deleted_time:string | null;
  artwork_data:ArtworkListItem[]
}

export type SnsList = {
  idx:number;
  category:string;
  user_idx:number;
  name:string;
  about:string;
  link_title:string;
  link_url:string;
  created_time:string;
  updated_time:string | null;
  deleted_time:string | null;
  like_count:number;
  read_count:number;
  image:TImage[];
  isLike:boolean;
  isBookmark:boolean;
  category_arr:number[]
}
export type SnsdetailsType = {
  idx:number;
  category:string;
  user_idx:number;
  name:string;
  about:string;
  link_title:string;
  link_url:string;
  created_time:string;
  updated_time:string | null;
  deleted_time:string | null;
  like_count:number;
  read_count:number;
  is_featured:string;
  is_hide:number;
  imageList:TImage[];
  isLike:boolean;
  isBookmark:boolean;
  user:UserType
}
export type FollowCardType = {
  idx:number;
  category:string;
  user_idx:number;
  name:string;
  about:string;
  link_title:string;
  link_url:string;
  created_time:string;
  updated_time:string | null;
  deleted_time:string | null;
  like_count:number;
  read_count:number;
  is_featured:string;
  is_hide:number;
  image:ImageType[];
  isLike:boolean;
  isBookmark:boolean;
  user:UserType
}