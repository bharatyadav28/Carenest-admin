import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Shield } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCareGiverById } from "@/store/data/care-giver/hook";
import {
  
  PageLoadingSpinner,
} from "@/components/LoadingSpinner";
import { EmptyTable } from "@/components/common/EmptyTable";

function CaregiverDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: userData, isLoading, error } = useCareGiverById(id || "");

  const user = userData?.data?.user?.[0];

  if (isLoading) return <PageLoadingSpinner  />;
  if (error) return <div className="text-red-500">Failed to load user data</div>;
  if (!user) return <EmptyTable colSpan={6} text="No user found" />;

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl"></div>
          <Card className="relative bg-gradient-card shadow-card border-border/50 backdrop-blur-sm">
            <CardContent className="p-2">
              <h3 className="text-xl font-semibold text-foreground mb-4 ps-2 flex items-center gap-2">
                Personal Information
              </h3>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-primary">
                      <img
                        src={user.avatar || "https://i.pravatar.cc/150?img=5"}
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
                      <Badge variant="secondary" className="bg-primary/10 text-blue-600 border-primary/20">
                        Caregiver
                      </Badge>
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        <Shield className="w-3 h-3 mr-1 text-green-700" />
                       <span className="text-green-600 font-bold"> Verified</span> 
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 font-bold text-primary">
                      ID
                      <span className="text-muted-foreground">{user.id}</span>
                    </div>
                    <div className="flex items-center gap-3 text-primary font-bold">
                      E-Mail
                      <span className="text-muted-foreground">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-primary">
                      Phone
                      <span className="text-muted-foreground">{user.mobile}</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-primary">
                      Address
                      <span className="text-muted-foreground">{user.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Profile */}
        <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-glow transition-all duration-300 mt-4">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              Job-Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Gender</span>
                <span className="text-foreground font-mono text-sm">
                  {user.gender || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Zipcode</span>
                <span className="text-foreground capitalize">{user.zipcode || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Years Experience</span>
                <span className="text-foreground font-mono text-sm">
                  {user.experienceMin && user.experienceMax
                    ? `${user.experienceMin} - ${user.experienceMax} yrs`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">Languages</span>
                <div className="flex gap-1">
                  {user.languages
                    ? user.languages.map((lang: string) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))
                    : "N/A"}
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">Price Range</span>
                <span className="text-foreground font-semibold">
                  {user.minPrice && user.maxPrice
                    ? `$${user.minPrice} - $${user.maxPrice}`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">Service Range</span>
                <span className="text-foreground">{user.locationRange || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">Caregiving Type</span>
                <span className="text-foreground">{user.caregivingType || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-2">Caretype</span>
                <div className="flex gap-1">
                  {user.services
                    ? user.services.map((care: string) => (
                        <Badge key={care} variant="outline" className="text-xs">
                          {care}
                        </Badge>
                      ))
                    : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CaregiverDetail;
