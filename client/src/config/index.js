export const registerFormControls = [{
        name: "userName",
        label: "User Name",
        placeholder: "Enter your user name",
        componentType: "input",
        type: "text",
    },
    {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        componentType: "input",
        type: "email",
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        componentType: "input",
        type: "password",
    },
];

export const loginFormControls = [{
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        componentType: "input",
        type: "email",
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        componentType: "input",
        type: "password",
    },
];

export const addProductFormElements = [{
        label: "Title",
        name: "title",
        componentType: "input",
        type: "text",
        placeholder: "Enter product title",
    },
    {
        label: "Description (supports basic HTML)",
        name: "description",
        componentType: "textarea",
        placeholder: `Enter product description.\nYou can use basic HTML like <a href=''>link</a>, <b>, <i> etc.`,
    },

    {
        label: "Category",
        name: "category",
        componentType: "select",
        options: [
            { id: "new", label: "New Arrival" },
            { id: "limited", label: "Limited Edition" },
            { id: "best", label: "Best Selling" },
            { id: "premium", label: "Premium Collections" },
            { id: "vintage", label: "Vintage" },
        ],
    },

    {
        label: "Price",
        name: "price",
        componentType: "input",
        type: "number",
        placeholder: "Enter product price",
    }, {
        label: "Sale Price",
        name: "salePrice",
        componentType: "input",
        type: "number",
        placeholder: "Enter sale price (optional)",
    }, {
        label: "Total Stock",
        name: "totalStock",
        componentType: "input",
        type: "number",
        placeholder: "Enter total stock",
    },
];

export const shoppingViewHeaderMenuItems = [{
        id: "home",
        label: "Home",
        path: "/shop/home",
    },
    {
        id: "products",
        label: "Products",
        path: "/shop/listing",
    },
    {
        id: "new",
        label: "New Arrival",
        path: "/shop/listing",
    },
    // {
    //     id: "limited",
    //     label: "Limited Edition",
    //     path: "/shop/listing",
    // },
    {
        id: "best",
        label: "Best Selling",
        path: "/shop/listing",
    },
    // {
    //     id: "premium",
    //     label: "Premium Collections",
    //     path: "/shop/listing",
    // },
    // {
    //     id: "vintage",
    //     label: "Vintage",
    //     path: "/shop/listing",
    // },

];

export const categoryOptionsMap = {
    new: "New Arrival",
    limited: "Limited Edition",
    best: "Best Selling",
    premium: "Premium Collections",
    vintage: "Vintage",
};

export const brandOptionsMap = {
    nike: "Nike",
    adidas: "Adidas",
    puma: "Puma",
    levi: "Levi",
    zara: "Zara",
    "h&m": "H&M",
};

export const filterOptions = {
    category: [
        { id: "new", label: "New Arrival" },
        { id: "limited", label: "Limited Edition" },
        { id: "best", label: "Best Selling" },
        { id: "premium", label: "Premium Collections" },
        { id: "vintage", label: "Vintage" },
        { id: "sport", label: "Sport Edition" },
    ],

};

export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [{
        label: "Address",
        name: "address",
        componentType: "input",
        type: "text",
        placeholder: "Enter your address",
    },
    {
        label: "City",
        name: "city",
        componentType: "input",
        type: "text",
        placeholder: "Enter your city",
    },
    {
        label: "Pincode",
        name: "pincode",
        componentType: "input",
        type: "text",
        placeholder: "Enter your pincode",
    },
    {
        label: "Phone",
        name: "phone",
        componentType: "input",
        type: "text",
        placeholder: "Enter your phone number",
    },
    {
        label: "Notes",
        name: "notes",
        componentType: "textarea",
        placeholder: "Enter any additional notes",
    },
];