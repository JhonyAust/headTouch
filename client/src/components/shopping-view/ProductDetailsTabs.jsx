import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Package, Star, Info, Truck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import StarRatingComponent from "../common/star-rating";

const ProductDetailsTabs = ({
  productDetails,
  reviews,
  rating,
  setRating,
  reviewMsg,
  setReviewMsg,
  handleAddReview,
}) => {
  const [activeTab, setActiveTab] = useState("description");
  const [accordionOpen, setAccordionOpen] = useState({
    description: false,
    reviews: false,
    additional: false,
    shipping: false,
  });

  const toggleAccordion = (tab) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [tab]: !prev[tab],
    }));
  };

  const tabConfig = [
    { value: "description", label: "Description", icon: Package },
    { value: "reviews", label: "Reviews", icon: Star },
    { value: "additional", label: "Additional Info", icon: Info },
    { value: "shipping", label: "Shipping Info", icon: Truck },
  ];

  const renderAccordionSection = (tab, title, content, Icon) => (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div
        className="flex justify-between items-center cursor-pointer px-5 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-200"
        onClick={() => toggleAccordion(tab)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-ds_orange/10 flex items-center justify-center">
            <Icon size={18} className="text-ds_orange" />
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <div className={`transform transition-transform duration-300 ${accordionOpen[tab] ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-gray-600" />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          accordionOpen[tab] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 py-4 text-sm text-gray-700 bg-white border-t border-gray-100">
          {content}
        </div>
      </div>
    </div>
  );

  const reviewContent = (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Star size={20} className="text-yellow-500 fill-yellow-500" />
          Customer Reviews
          {reviews?.length > 0 && (
            <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
          )}
        </h2>
        {reviews?.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-ds_orange to-orange-600 text-white font-semibold">
                    {r.userName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{r.userName}</h3>
                  <StarRatingComponent rating={r.reviewValue} />
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.reviewMessage}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-gray-50 rounded-xl">
            <Star size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">Write Your Review</Label>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Your Rating</p>
            <StarRatingComponent rating={rating} handleRatingChange={setRating} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Your Review</p>
            <Input
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="bg-white border-gray-300 focus:border-ds_orange focus:ring-ds_orange"
            />
          </div>
          <Button 
            className="w-full bg-ds_orange hover:bg-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
            disabled={!reviewMsg.trim()} 
            onClick={handleAddReview}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile Accordion View */}
      <div className="block sm:hidden mt-8 px-4">
        {renderAccordionSection(
          "description",
          "Description",
          productDetails.description ? (
            <div
              className="whitespace-pre-line leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
              dangerouslySetInnerHTML={{ __html: productDetails.description }}
            />
          ) : (
            <p className="text-gray-500 text-center py-4">No description available.</p>
          ),
          Package
        )}

        {renderAccordionSection("reviews", "Reviews", reviewContent, Star)}

        {renderAccordionSection(
          "additional",
          "Additional Info",
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <InfoItem label="Style" value="Classic Bangladeshi streetwear" />
              <InfoItem label="Material" value="Durable cotton blend — perfect for all seasons" />
              <InfoItem label="Design" value="Embroidered flag & bold typography for deshi pride" />
              <InfoItem label="Fit" value="One size fits most — adjustable strap at the back" />
              <InfoItem label="Perfect For" value="Everyday wear, cricket matches, rallies, or just repping your roots" />
            </div>
          </div>,
          Info
        )}

        {renderAccordionSection(
          "shipping",
          "Shipping Info",
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <ShippingItem label="Inside Dhaka" value="৳ 80" />
              <ShippingItem label="Outside Dhaka" value="৳ 150" />
              <ShippingItem label="Delivery Time" value="2–4 business days" />
            </div>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <p className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>All products are quality-checked before dispatch</span>
              </p>
              <p className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Easy return within 24 hours for damaged products</span>
              </p>
            </div>
          </div>,
          Truck
        )}
      </div>

      {/* Desktop Tabs View */}
      <Tabs
        defaultValue="description"
        className="w-full max-w-6xl mx-auto mt-12 hidden sm:block"
      >
        <TabsList className="flex justify-center w-full bg-gray-100 rounded-2xl p-2 mb-8 shadow-inner">
          {tabConfig.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              onClick={() => setActiveTab(value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === value
                  ? "bg-white text-ds_orange shadow-md scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              <span className="hidden lg:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <TabsContent value="description" className="mt-0">
            {productDetails.description ? (
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-line prose max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800 [&_a]:transition-colors"
                dangerouslySetInnerHTML={{ __html: productDetails.description }}
              />
            ) : (
              <p className="text-gray-500 text-center py-12">No description available.</p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <div className="max-h-[500px] overflow-auto pr-2 custom-scrollbar">
              {reviewContent}
            </div>
          </TabsContent>

          <TabsContent value="additional" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              <InfoItem label="Style" value="Classic Bangladeshi streetwear" large />
              <InfoItem label="Material" value="Durable cotton blend — perfect for all seasons" large />
              <InfoItem label="Design" value="Embroidered flag & bold typography for deshi pride" large />
              <InfoItem label="Fit" value="One size fits most — adjustable strap at the back" large />
              <InfoItem label="Perfect For" value="Everyday wear, cricket matches, rallies, or just repping your roots" large />
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ShippingCard label="Inside Dhaka" value="৳ 80" icon="🏙️" />
                <ShippingCard label="Outside Dhaka" value="৳ 150" icon="🚚" />
                <ShippingCard label="Delivery Time" value="2–4 business days" icon="⚡" />
              </div>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  Our Guarantee
                </h3>
                <div className="space-y-3">
                  <p className="flex items-start gap-3 text-green-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>All products are quality-checked before dispatch</span>
                  </p>
                  <p className="flex items-start gap-3 text-green-800">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Easy return within 24 hours for damaged products</span>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

const InfoItem = ({ label, value, large }) => (
  <div className={`${large ? 'p-4 bg-gray-50 rounded-lg hover:bg-gray-100' : ''} transition-colors duration-200`}>
    <span className="font-semibold text-gray-900">{label}:</span>{" "}
    <span className="text-gray-600">{value}</span>
  </div>
);

const ShippingItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="font-semibold text-ds_orange">{value}</span>
  </div>
);

const ShippingCard = ({ label, value, icon }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-300 hover:scale-105">
    <div className="text-3xl mb-3">{icon}</div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

export default ProductDetailsTabs;