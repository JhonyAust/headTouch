import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown, Package, Star, Info, Truck, MessageSquare, Send, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import StarRatingComponent from "../common/star-rating";
import { openLoginPopup } from "@/store/loginRegister-slice";

const ProductDetailsTabs = ({
  productDetails,
  reviews,
  rating,
  setRating,
  reviewMsg,
  setReviewMsg,
  handleAddReview,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
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

  const handleReviewSubmit = () => {
    if (!user) {
      dispatch(openLoginPopup());
      return;
    }
    
    if (!rating) {
      // Show a visual indicator that rating is required
      return;
    }
    
    if (!reviewMsg.trim()) {
      // Show a visual indicator that message is required
      return;
    }
    
    handleAddReview();
  };

  const tabConfig = [
    { value: "description", label: "Description", icon: Package },
    { value: "reviews", label: "Reviews", icon: Star, badge: reviews?.length },
    { value: "additional", label: "Additional Info", icon: Info },
    { value: "shipping", label: "Shipping", icon: Truck },
  ];

  const renderAccordionSection = (tab, title, content, Icon, badge) => (
    <div className="mb-3 overflow-hidden rounded-xl">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div
          className="flex justify-between items-center cursor-pointer px-5 py-4 bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-white transition-all duration-300"
          onClick={() => toggleAccordion(tab)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {badge > 0 && (
                <span className="text-xs text-purple-600 font-medium">
                  {badge} reviews
                </span>
              )}
            </div>
          </div>
          <div className={`transform transition-transform duration-300 ${accordionOpen[tab] ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            accordionOpen[tab] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-5 py-5 text-sm text-gray-700 bg-gray-50 border-t border-gray-100">
            {content}
          </div>
        </div>
      </div>
    </div>
  );

  const reviewContent = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
            <Star size={20} className="text-yellow-500 fill-yellow-500" />
            Customer Reviews
          </h2>
          {reviews?.length > 0 && (
            <span className="text-sm font-medium text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          )}
        </div>

        {reviews?.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div 
                key={i} 
                className="flex gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-300"
              >
                <Avatar className="w-10 h-10 border-2 border-purple-100">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
                    {r.userName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{r.userName}</h3>
                    <div className="flex items-center gap-1">
                      <StarRatingComponent rating={r.reviewValue} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.reviewMessage}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <Star size={48} className="mx-auto text-purple-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Reviews Yet</h3>
            <p className="text-gray-600 text-sm">Be the first to share your experience!</p>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <Label className="text-lg font-bold text-gray-900 block">Write Your Review</Label>
            <p className="text-xs text-gray-600">Share your experience with others</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
              <span>Your Rating</span>
              {!rating && <span className="text-xs text-orange-600">Required *</span>}
            </p>
            <div className="flex items-center gap-3">
              <StarRatingComponent rating={rating} handleRatingChange={setRating} />
              <span className="text-sm font-medium text-gray-600">
                {rating > 0 ? `${rating} out of 5` : 'Select rating'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
              <span>Your Review</span>
              {!reviewMsg.trim() && <span className="text-xs text-orange-600">Required *</span>}
            </p>
            <Textarea
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              maxLength={500}
              placeholder="Share your thoughts about this product..."
              className="min-h-[100px] bg-white border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg resize-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">{reviewMsg.length}/500 characters</p>
          </div>

          <Button 
            className="w-full h-11 text-sm font-semibold
            bg-gradient-to-r from-orange-500 to-red-500
            hover:from-orange-600 hover:to-red-600
            text-white rounded-lg shadow-md hover:shadow-lg 
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
            disabled={!rating || !reviewMsg.trim()} 
            onClick={handleReviewSubmit}
          >
            <Send size={16} />
            {user ? 'Submit Review' : 'Sign In to Review'}
          </Button>

          {!user && (
            <p className="text-center text-xs text-gray-600 bg-purple-100 py-2 rounded-lg">
              Please sign in to submit a review
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile Accordion View */}
      <div className="block lg:hidden mt-8 px-4">
        {renderAccordionSection(
          "description",
          "Description",
          productDetails.description ? (
            <div
              className="whitespace-pre-line leading-relaxed prose max-w-none prose-sm [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
              dangerouslySetInnerHTML={{ __html: productDetails.description }}
            />
          ) : (
            <p className="text-gray-500 text-center py-6">No description available.</p>
          ),
          Package
        )}

        {renderAccordionSection("reviews", "Reviews", reviewContent, Star, reviews?.length)}

        {renderAccordionSection(
          "additional",
          "Additional Info",
          <div className="space-y-2">
            <InfoItem label="Style" value="Classic Bangladeshi streetwear" />
            <InfoItem label="Material" value="Durable cotton blend — perfect for all seasons" />
            <InfoItem label="Design" value="Embroidered flag & bold typography for deshi pride" />
            <InfoItem label="Fit" value="One size fits most — adjustable strap at the back" />
            <InfoItem label="Perfect For" value="Everyday wear, cricket matches, rallies, or just repping your roots" />
          </div>,
          Info
        )}

        {renderAccordionSection(
          "shipping",
          "Shipping Info",
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <ShippingItem label="Inside Dhaka" value="৳ 80" />
              <ShippingItem label="Outside Dhaka" value="৳ 150" />
              <ShippingItem label="Delivery Time" value="2–4 business days" />
            </div>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <p className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-600">✓</span>
                <span>All products are quality-checked before dispatch</span>
              </p>
              <p className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-600">✓</span>
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
        className="w-full max-w-6xl mx-auto mt-12 hidden lg:block"
      >
        <div className="relative mb-8">
          <TabsList className="flex justify-center gap-3 w-full bg-transparent p-0">
            {tabConfig.map(({ value, label, icon: Icon, badge }) => (
              <TabsTrigger
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={`relative flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-500 overflow-hidden group border-2 ${
                  activeTab === value
                    ? "border-transparent shadow-xl scale-105"
                    : "bg-white text-gray-600 hover:text-gray-900 border-gray-200 hover:border-purple-300 shadow-md hover:shadow-lg hover:scale-102"
                }`}
              >
                {activeTab === value && (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,#a855f7_0%,#ec4899_50%,#f97316_100%)] opacity-100"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:200%_100%] animate-shimmer-slow"></div>
                  </>
                )}
                <Icon size={18} className={`relative z-10 ${activeTab === value ? 'text-white' : ''}`} />
                <span className={`relative z-10 ${activeTab === value ? 'text-white' : ''}`}>{label}</span>
                {badge > 0 && (
                  <span className={`relative z-10 ${
                    activeTab === value 
                      ? 'bg-white text-purple-600' 
                      : 'bg-purple-100 text-purple-600'
                  } text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center`}>
                    {badge}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

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
            <div className="max-h-[600px] overflow-auto pr-2 custom-scrollbar">
              {reviewContent}
            </div>
          </TabsContent>

          <TabsContent value="additional" className="mt-0">
            <div className="grid grid-cols-1 gap-3">
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
                <ShippingCard label="Outside Dhaka" value="৳ 120" icon="🚚" />
                <ShippingCard label="Delivery Time" value="2–4 business days" icon="⚡" />
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-900 text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  Our Guarantee
                </h3>
                <div className="space-y-3">
                  <p className="flex items-start gap-3 text-green-800 text-sm">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>All products are quality-checked before dispatch</span>
                  </p>
                  <p className="flex items-start gap-3 text-green-800 text-sm">
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
        @keyframes shimmer-slow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-shimmer-slow {
          animation: shimmer-slow 6s ease-in-out infinite;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
};

const InfoItem = ({ label, value, large }) => (
  <div className={`${large ? 'p-4 bg-gray-50 rounded-lg hover:bg-purple-50 border border-gray-200 hover:border-purple-300' : ''} transition-all duration-300`}>
    <span className="font-semibold text-gray-900 text-sm">{label}:</span>{" "}
    <span className="text-gray-600 text-sm">{value}</span>
  </div>
);

const ShippingItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-300">
    <span className="font-medium text-gray-700 text-sm">{label}:</span>
    <span className="font-bold text-orange-600">{value}</span>
  </div>
);

const ShippingCard = ({ label, value, icon }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer group">
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <p className="text-xs text-gray-600 mb-1 font-medium">{label}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

export default ProductDetailsTabs;