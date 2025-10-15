import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Eye,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminFeatures() {
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrls || uploadedImageUrls.length === 0) return;

    uploadedImageUrls.forEach((url) => {
      dispatch(addFeatureImage(url)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
        }
      });
    });

    setUploadedImageUrls([]);
  }

  function handleDeleteFeatureImage(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 p-4 md:p-8">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              background: i % 2 === 0 ? '#6366f1' : '#a855f7',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Header Section */}
        <div className="animate-slide-down">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-subtle">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 bg-clip-text text-transparent">
                Feature Images
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Manage banner images for your homepage
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="border-2 border-indigo-100 shadow-lg overflow-hidden">
            <CardContent className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-600 mb-1">Active Banners</p>
                    <p className="text-3xl font-black text-gray-900">
                      {featureImageList?.length || 0}
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
                  Live Images
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="border-2 border-purple-100 shadow-xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8 bg-gradient-to-br from-white to-purple-50/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload New Images</h2>
                <p className="text-sm text-gray-600">Add images to your homepage banner</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100 mb-6">
              <ProductImageUpload
                uploadedImageUrls={uploadedImageUrls}
                setUploadedImageUrls={setUploadedImageUrls}
              />
            </div>

            <Button 
              onClick={handleUploadFeatureImage}
              disabled={!uploadedImageUrls || uploadedImageUrls.length === 0}
              className="group w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-14 rounded-xl text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              <Upload className="w-5 h-5 mr-2 group-hover:translate-y-[-2px] transition-transform duration-300" />
              Upload Feature Images
              <CheckCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
            </Button>
          </CardContent>
        </Card>

        {/* Images Gallery */}
        <Card className="border-2 border-blue-100 shadow-xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Current Banner Images</h2>
                  <p className="text-sm text-gray-600">Manage your active banners</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
                {featureImageList?.length || 0} Images
              </Badge>
            </div>

            {featureImageList && featureImageList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureImageList.map((featureImgItem, index) => (
                  <div
                    key={featureImgItem._id}
                    className="group relative rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-indigo-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={featureImgItem.image}
                        className="w-full h-[250px] object-cover transition-transform duration-500 group-hover:scale-110"
                        alt="Feature Banner"
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Image Index Badge */}
                      <Badge className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 font-bold shadow-lg">
                        #{index + 1}
                      </Badge>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-xl hover:shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>

                      {/* View Overlay Text */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">Banner Image</span>
                          <Eye className="w-4 h-4 text-indigo-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
                  <div className="relative bg-gradient-to-br from-white to-indigo-50/50 rounded-full p-12 border-2 border-indigo-200/50 shadow-2xl">
                    <AlertCircle className="w-24 h-24 text-indigo-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Banner Images Yet</h3>
                <p className="text-gray-500 text-base mb-8 max-w-md text-center leading-relaxed">
                  Upload your first banner image to showcase on your homepage
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AdminFeatures;