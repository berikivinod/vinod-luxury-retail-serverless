export interface Store {
  id: number;
  name: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;

  address: string;
  phone: string;

  hours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };

  restaurants: string[];
  services: string[];
}

