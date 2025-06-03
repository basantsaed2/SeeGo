import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/Loading';
import { MapPin, Users, Phone } from 'lucide-react'; // Corrected and relevant icons

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example for language direction (rtl/ltr)
  const dira = 'ltr'; // or 'rtl' based on language
  const t = (text) => text; // Placeholder translation function, replace with actual i18n

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://bcknd.sea-go.org/village/admin_village/my_profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.admin);
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg"><Loading /></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-lg text-red-500">{error}</div>;
  if (!data) return <div className="flex justify-center items-center h-screen text-lg">No profile data available.</div>;

  // Status (Active / Inactive)
  const status = data.status === 1 ? 'Active' : 'Inactive';

  return (
    <div className="flex h-auto">
      <div className="flex-1 flex">
        <Card className="!p-8 !mb-2 bg-gradient-to-br from-[#f3fbfa] to-white w-full shadow-lg border-none rounded-2xl transition-all duration-300 hover:shadow-xl">
          <CardContent className="flex flex-col gap-6">
            <div dir={dira} className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {data.image_link ? (
                  <img
                    src={data.image_link}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#297878] transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-[#297878] text-white">
                      {data.name ? data.name.charAt(0).toUpperCase() : 'V'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <h3 className="text-xl font-bold text-[#297878] tracking-tight">
                  {data.name || 'N/A'}
                </h3>
              </div>
              <Badge
                variant="outline"
                className={`!px-5 !py-2 text-sm font-medium cursor-pointer rounded-full transition-colors duration-200 ${
                  status === 'Active'
                    ? 'bg-green-100 hover:bg-green-200 text-green-800'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#297878]">
              {[
                { field: 'email', icon: MapPin, label: t('Email') },
                { field: 'position', icon: Users, label: t('Position') },
                { field: 'phone', icon: Phone, label: t('Phone') },
              ].map(({ field, icon: Icon, label }) => {
                const value = data[field];
                const displayValue =
                  typeof value === 'object' && value !== null ? value.name || 'N/A' : value || 'N/A';

                return (
                  <div
                    dir={dira}
                    key={field}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#e6f0ef] transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5 text-[#297878] flex-shrink-0" />
                    <div>
                      <span className="font-semibold">{label}:</span>
                      <span className="ml-2 text-gray-800">{displayValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;