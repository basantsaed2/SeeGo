import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast, ToastContainer } from 'react-toastify';
import FooterInvoiceImage from "@/assets/FooterInvoice.png";
import { usePost } from '@/Hooks/UsePost';
import { useGet } from '@/Hooks/UseGet';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";
import Loading from '@/components/Loading';
import { useLocation } from 'react-router-dom';

const Packages = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPackageId, setCurrentPackageId] = useState(null);
const location = useLocation();

  const { refetch: refetchPackages, loading: loadingPackages, data: PackagesData } =
    useGet({ url: `${apiUrl}/payment_package/lists` });

  const { refetch: refetchProfile, loading: loadingProfile, data: ProfileData } =
    useGet({ url: `${apiUrl}/admin_village/my_profile` });

  const { postData, loading: loadingPost, response } =
    usePost({ url: `${apiUrl}/payment_package` });

  const { t } = useTranslation();

  useEffect(() => {
    refetchPackages();
    refetchProfile();
  }, [refetchPackages, refetchProfile]);

  useEffect(() => {
    if (PackagesData?.packages && PackagesData?.payment_methods) {
      setPackages(PackagesData.packages);
      setPaymentMethods(PackagesData.payment_methods);
    }
  }, [PackagesData]);

  useEffect(() => {
    if (ProfileData) {
      setUserProfile(ProfileData);
      let packageId = null;

      if (ProfileData.package?.id) {
        packageId = ProfileData.package.id;
      } else if (ProfileData.village?.package_id) {
        packageId = ProfileData.village.package_id;
      } else if (ProfileData.admin?.village?.package_id) {
        packageId = ProfileData.admin.village.package_id;
      }

      setCurrentPackageId(packageId);
    }
  }, [ProfileData]);

  const hasAnyPackage = !!userProfile?.package?.id;

  const handlePayClick = (subscription) => {
    setSelectedPackage(subscription);
  };

  useEffect(() => {
    if (!loadingPost && response) {
      setSelectedPackage(null);
      setSelectedPaymentMethod(null);
      setReceipt(null);
      refetchProfile();
      const timer = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [response, loadingPost, refetchProfile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !selectedPaymentMethod || !receipt) {
      toast.error(t('Please select a payment method and upload a receipt'));
      return;
    }

    const body = new FormData();
    body.append("payment_method_id", selectedPaymentMethod.id);
    body.append("package_id", selectedPackage.id);
    body.append("amount", selectedPackage.price);
    body.append("discount", selectedPackage.discount || '0');
    body.append("receipt", receipt);

    await postData(body, t("PackagePaidSuccess"));
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

const getButtonText = (subscription) => {
  const currentId = String(currentPackageId ?? '');
  const subscriptionId = String(subscription.id);

  if (currentId === subscriptionId) {
    return t("Upgrade"); // غيريها للترجمة اللي عندك لو متاحة
  }

  if (currentId) {
    return t("Pay");
  }

  return t("Pay");
};





const getButtonStyle = (subscription) => {
  const currentId = String(currentPackageId ?? '');
  const subscriptionId = String(subscription.id);
  
  if (currentId === subscriptionId) return "bg-gray-500 hover:bg-gray-600 ";
  if (currentId) return "bg-bg-primary hover:bg-teal-600";
  return "bg-bg-primary hover:bg-teal-600";
};

  if (loadingPackages || loadingProfile) {
    return (
      <div className="!p-10 flex justify-center items-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="!p-10">
      <div className="flex justify-between items-center !mb-6">
        <h1 className="text-3xl font-bold text-bg-primary">{t("ChooseYourPackage")}</h1>
{location.pathname === '/packages' && (
  <a
    href="/"
    className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg !px-4 !py-2 text-sm font-medium transition-colors"
  >
    {t("Skip")}
  </a>
)}


      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((subscription) => (
          <Card key={subscription.id}
className={`bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col justify-between min-h-[340px] 
  ${String(currentPackageId) === String(subscription.id) 
    ? 'border-4 border-green-600' 
    : '!border-none'}
`}

          >
            <CardHeader
              className="!p-4 flex justify-between items-center"
              style={{
                backgroundImage: `url(${FooterInvoiceImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                color: 'white',
              }}
            >
              <div>
                <CardTitle className="text-xl text-bg-primary font-bold">
                  {subscription.name}

                </CardTitle>
                <CardDescription className="text-sm text-bg-primary">
                  {subscription.type}
                </CardDescription>
              </div>
              {subscription.discount !== '—' && (
                <span className="bg-gray-300 text-black text-xs font-semibold !px-2 !py-1 rounded-full">
                  {subscription.discount}% {t("OFF")}
                </span>
              )}
            </CardHeader>

            <CardContent className="!p-4 flex-1">
              <p className="text-gray-600 text-sm !mb-2">{subscription.description}</p>
              <p className="text-lg font-semibold text-gray-800">
                <span className="line-through text-gray-500 !mr-2">
                  {subscription.feez !== '—' ? `${subscription.feez} EGP` : ''}
                </span>
                {subscription.price} EGP
              </p>
              <div className="!mt-3 space-y-2">
                {subscription.type === 'village' && (
                  <>
                    <p className="text-sm text-gray-700"><span className="font-medium">{t("AdminNumber")}</span> {subscription.admin_num}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">{t("SecurityNumber")}</span> {subscription.security_num}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">{t("MaintenanceModule")}</span> {subscription.maintenance_module ? t('Enabled') : t('Disabled')}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">{t("BeachPoolModule")}</span> {subscription.beach_pool_module ? t('Enabled') : t('Disabled')}</p>
                  </>
                )}
              </div>
            </CardContent>

            <CardFooter className="!p-4 border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => handlePayClick(subscription)}
                className={`${getButtonStyle(subscription)} text-white rounded-lg !px-4 !py-2`}
              
                
              >
                {getButtonText(subscription)}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPackage} onOpenChange={(open) => {
        if (!open) {
          setSelectedPackage(null);
          setSelectedPaymentMethod(null);
          setReceipt(null);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentPackageId && String(currentPackageId) !== String(selectedPackage?.id)
                ? t("Upgrade Package") : t("Complete Payment")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="!mb-4">
              <Label className="block text-sm font-medium text-gray-700 !mb-2">
                {t("Select Payment Method")}
              </Label>
              <RadioGroup
                onValueChange={(value) =>
                  setSelectedPaymentMethod(
                    paymentMethods.find((method) => method.id === value)
                  )
                }
                className="!space-y-2"
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center gap-2 border rounded-lg !p-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center gap-2">
                      <img
                        src={method.image_link}
                        alt={method.name}
                        className="w-12 h-12 object-contain rounded-full"
                      />
                      <div>
                        <Label htmlFor={method.id} className="text-sm font-medium">{method.name}</Label>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="!mb-4">
              <Label className="block text-sm font-medium text-gray-700 !mb-2">{t("Upload Receipt")}</Label>
              <Input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="w-full !p-2" />
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  setSelectedPackage(null);
                  setSelectedPaymentMethod(null);
                  setReceipt(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg !px-4 !py-2"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-bg-primary hover:bg-teal-600 text-white rounded-lg !px-4 !py-2"
                disabled={loadingPost || !selectedPaymentMethod || !receipt}
              >
                {loadingPost
                  ? t("Processing...")
                  : (currentPackageId && String(currentPackageId) !== String(selectedPackage?.id)
                    ? t("Confirm Upgrade")
                    : t("Confirm Payment"))}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Packages;
