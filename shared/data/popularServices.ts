interface PopularServiceItem {
    id: number;
    name: string;
    image: any;
  }

export const popularServices: PopularServiceItem[] = [
    {
        id: 44,
        name: "Grocery Shopping",
        image: require("../../assets/images/images/groceryshop.jpg"),
      },
      {
        id: 53,
        name: "Item Delivery",
        image: require("../../assets/images/images/delivery.jpg"),
      },
      {
        id: 56,
        name: "Laundry",
        image: require("../../assets/images/images/laundry.jpg"),
      },
      {
        id: 40,
        name: "Fumigation",
        image: require("../../assets/images/images/fumigation.jpg"),
      },
      {
        id: 35,
        name: "Electrician",
        image: require("../../assets/images/images/electrician.jpg"),
      },
  
      {
        id: 20,
        name: "Cook/Chef",
        image: require("../../assets/images/images/chefCook.jpg"),
      },
      {
        id: 8,
        name: "Barber",
        image: require("../../assets/images/images/barber.jpg"),
      },
      {
        id: 46,
        name: "Hair Stylist",
        image: require("../../assets/images/images/hairstylist.jpg"),
      },
      {
        id: 73,
        name: "Plumber",
        image: require("../../assets/images/images/plumber.jpg"),
      },
      {
        id: 33,
        name: "Dry Cleaning",
        image: require("../../assets/images/images/dryclean1.jpg"),
      },
      {
        id: 48,
        name: "House Cleaning",
        image: require("../../assets/images/images/homecleaning.jpg"),
      },
      {
        id: 68,
        name: "Office Cleaning",
        image: require("../../assets/images/images/officecleaning.jpg"),
      },
    // ...add other services
  ];