import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
// import { Shield } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCareSeekerById } from "@/store/data/care-seeker/hook";
import {
  
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";import { EmptyTable } from "@/components/common/EmptyTable";
import { cdnURL } from "../../lib/resuable-data";

function CareseekerDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: userData, isLoading: isUserLoading, error: userError } = useCareSeekerById(id || "");

  const user = userData?.data?.user?.[0];


  if (isUserLoading) return <PageLoadingSpinner />;
  if (userError) return <div className="text-red-500">Failed to load user data</div>;
  if (!user) return <EmptyTable colSpan={6} text="No user found" />;

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl"></div>
          <Card className="relative bg-gradient-card shadow-card border-border/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                Personal Information
              </h3>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-primary">
                      <img
                        src={`${cdnURL}${user.avatar || "https://i.pravatar.cc/150?img=5"}`}
                        alt={`${user.name} avatar`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-blue-500 border-primary/20">
                        Careseeker
                      </Badge>
                      {/* <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        <Shield className="w-3 h-3 mr-1 text-green-700" />
                        Verified
                      </Badge> */}
                    </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 font-bold text-white">
                      ID :-
                      <span className="text-muted-foreground">{user.id}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white font-bold">
                      E-Mail :-
                      <span className="text-muted-foreground">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-white">
                      Phone  :-
                      <span className="text-muted-foreground">{user.mobile}</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-white">
                      Address :-
                      <span className="text-muted-foreground">{user.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground font-bold">
                      <span className="font-bold text-white">Zipcode :-</span>
                      <span>{user.zipcode}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground font-bold">
                      <span className="font-bold text-white">Gender :-</span>
                      <span className="capitalize">{user.gender || "N/A"}</span>
                    </div>
                  </div>

             
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CareseekerDetail;
