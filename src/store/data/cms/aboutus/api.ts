import axiosInstance from "@/store/axiosInstance";

export interface KeyPersonType {
  id: string;
  personName: string;
  personImage: string;
  personTitle: string;
  personDescription: string;
}

export interface ValueType {
  id: string;
  valueName: string;
  valueDescription: string;
}

export interface TeamMemberType {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface AboutUsType {
  id: string;
  mainHeading: string;
  mainDescription: string;
  keyPeople: KeyPersonType[];
  valuesHeading: string;
  ourValues: ValueType[];
  missionDescription: string;
  meetTeamHeading: string;
  meetTeamDescription: string;
  teamMembers: TeamMemberType[];
  createdAt: string;
  updatedAt: string;
}

export interface AboutUsUpdateType {
  mainHeading?: string;
  mainDescription?: string;
  keyPeople?: KeyPersonType[];
  valuesHeading?: string;
  ourValues?: ValueType[];
  missionDescription?: string;
  meetTeamHeading?: string;
  meetTeamDescription?: string;
  teamMembers?: TeamMemberType[];
}

export const fetchAboutUs = async () => {
  const { data } = await axiosInstance.get(`/api/v1/about-us`);
  return data;
};

export const updateAboutUs = async (updateData: AboutUsUpdateType) => {
  const currentData = await fetchAboutUs();
  const aboutUsId = currentData.data.aboutUs.id;
  
  const { data } = await axiosInstance.put(
    `/api/v1/about-us/${aboutUsId}`,
    updateData
  );
  return data;
};

export const createAboutUs = async (aboutData: AboutUsUpdateType) => {
  const { data } = await axiosInstance.post(`/api/v1/about-us`, aboutData);
  return data;
};

export const deleteAboutUs = async () => {
  const currentData = await fetchAboutUs();
  const aboutUsId = currentData.data.aboutUs.id;
  
  const { data } = await axiosInstance.delete(
    `/api/v1/about-us/${aboutUsId}`
  );
  return data;
};

// Section-specific updates
export const updateKeyPeople = async (keyPeople: KeyPersonType[]) => {
  const currentData = await fetchAboutUs();
  const aboutUsId = currentData.data.aboutUs.id;
  
  const { data } = await axiosInstance.patch(
    `/api/v1/about-us/${aboutUsId}/key-people`,
    { keyPeople }
  );
  return data;
};

export const updateTeamMembers = async (teamMembers: TeamMemberType[]) => {
  const currentData = await fetchAboutUs();
  const aboutUsId = currentData.data.aboutUs.id;
  
  const { data } = await axiosInstance.patch(
    `/api/v1/about-us/${aboutUsId}/team-members`,
    { teamMembers }
  );
  return data;
};

export const updateOurValues = async (ourValues: ValueType[]) => {
  const currentData = await fetchAboutUs();
  const aboutUsId = currentData.data.aboutUs.id;
  
  const { data } = await axiosInstance.patch(
    `/api/v1/about-us/${aboutUsId}/our-values`,
    { ourValues }
  );
  return data;
};