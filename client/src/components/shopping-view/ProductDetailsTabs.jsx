import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
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

  const renderAccordionSection = (tab, title, content) => (
    <div className="border-b py-3 sm:hidden">
      <div
        className="flex justify-between items-center cursor-pointer px-4"
        onClick={() => toggleAccordion(tab)}
      >
        <h3 className="font-semibold">{title}</h3>
        {accordionOpen[tab] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {accordionOpen[tab] && <div className="mt-2 px-4 text-sm text-muted-foreground">{content}</div>}
    </div>
  );

  return (
    <>
      {/* Mobile Accordion View */}
      <div className="block sm:hidden mt-8">
        {renderAccordionSection(
          "description",
          "Description",
          productDetails.description ? (
            <div
              className="whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: productDetails.description }}
            />
          ) : (
            <p>No description available.</p>
          )
        )}

        {renderAccordionSection(
          "reviews",
          "Reviews",
          <>
            <h2 className="font-bold my-4">Customer Reviews</h2>
            {reviews?.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="flex gap-4 mb-4">
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>{r.userName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{r.userName}</h3>
                    <StarRatingComponent rating={r.reviewValue} />
                    <p className="text-sm text-muted-foreground">{r.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
            <div className="mt-4 space-y-6 ">
              <Label>Write a review</Label>
              <StarRatingComponent rating={rating} handleRatingChange={setRating} />
              <Input
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button className="mt-4" disabled={!reviewMsg.trim()} onClick={handleAddReview}>
                Submit
              </Button>
            </div>
          </>
        )}

        {renderAccordionSection(
          "additional",
          "Additional Info",
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Material:</strong> PU Leather + Rubber Sole</li>
            <li><strong>Category:</strong> Casual Chinese Sneakers</li>
            <li><strong>Fit:</strong> True to size</li>
            <li><strong>Size Guide:</strong></li>
            <li>L: 42–44 (EU)</li>
            <li>M: 38–40 (EU)</li>
            <li>S: 34–36 (EU)</li>
            <li>XL: 46–48 (EU)</li>
          </ul>
        )}

        {renderAccordionSection(
          "shipping",
          "Shipping Info",
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Inside Dhaka:</strong> ৳ 80</li>
            <li><strong>Outside Dhaka:</strong> ৳ 150</li>
            <li><strong>Delivery Time:</strong> 2–4 business days</li>
            <li>All products are quality-checked before dispatch.</li>
            <li>Easy return within 24 hours for damaged products.</li>
          </ul>
        )}
      </div>

      {/* Desktop Tabs View */}
      <Tabs
        defaultValue="description"
        className="w-full max-w-5xl mx-auto mt-10 hidden sm:block"
      >
        <TabsList className="flex justify-center w-full border-b mb-6">
          {["description", "reviews", "additional", "shipping"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 sm:px-12 py-2 cursor-pointer ${
                activeTab === tab ? "text-ds_orange font-bold border-t-4 border-ds_orange" : ""
              }`}
            >
              {{
                description: "Description",
                reviews: "Reviews",
                additional: "Additional Info",
                shipping: "Shipping Info",
              }[tab]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="description">
          {productDetails.description ? (
            <div
              className="text-muted-foreground whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: productDetails.description }}
            />
          ) : (
            <p className="text-muted-foreground">No description available.</p>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          <div className="max-h-[300px] overflow-auto space-y-6">
            {reviews?.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="flex gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>{r.userName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{r.userName}</h3>
                    <StarRatingComponent rating={r.reviewValue} />
                    <p className="text-muted-foreground">{r.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-2">No Reviews</p>
            )}
          </div>
          <div className="mt-6 space-y-6">
            <Label className="mr-4">Write a review</Label>
            <StarRatingComponent rating={rating} handleRatingChange={setRating} />
            <Input
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Write a review..."
              className="mb-4"
            />
            <Button  disabled={!reviewMsg.trim()} onClick={handleAddReview}>
              Submit
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="additional">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Material:</strong> PU Leather + Rubber Sole</li>
            <li><strong>Category:</strong> Casual Chinese Sneakers</li>
            <li><strong>Fit:</strong> True to size</li>
            <li><strong>Size Guide:</strong></li>
            <li>L: 42–44 (EU)</li>
            <li>M: 38–40 (EU)</li>
            <li>S: 34–36 (EU)</li>
            <li>XL: 46–48 (EU)</li>
          </ul>
        </TabsContent>

        <TabsContent value="shipping">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Inside Dhaka:</strong> ৳ 80</li>
            <li><strong>Outside Dhaka:</strong> ৳ 150</li>
            <li><strong>Delivery Time:</strong> 2–4 business days</li>
            <li>All products are quality-checked before dispatch.</li>
            <li>Easy return within 24 hours for damaged products.</li>
          </ul>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProductDetailsTabs;
