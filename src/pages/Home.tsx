import { useEffect } from "react";

// import WorkInProgress from "@/components/common/WorkInProgress";
import { PageLoadingSpinner } from "@/components/LoadingSpinner";
import { showError } from "@/lib/resuable-fns";
import DashboardItem from "@/components/DashboardItem";
import { useGetDashboardData } from "@/store/data/general/hooks";

function Home() {
  const { data, isFetching, error } = useGetDashboardData();

  const stats = data?.data.stats;

  const dataList = [
    {
      name: "Total careseekers",
      count: stats?.totalSeekers || 0,
      color: "#ADD8E6",
      href: "/care-seeker",
      state: {},
    },
    {
      name: "Total caregivers",
      count: stats?.totalGivers || 0,
      color: "#90EE90",
      href: "/care-giver",
      state: {},
    },

    {
      name: "Total bookings",
      count: stats?.totalBookings || 0,
      color: "#F08080",
      href: "/bookings",
      state: {},
    },

    {
      name: "Completed bookings",
      count: stats?.completedBookings || 0,
      color: "#FFB6C1",
      href: "/bookings",
      state: { status: "completed" },
    },
    {
      name: "Pending bookings",
      count: stats?.pendingBookings || 0,
      color: "#FFA07A",
      href: "/bookings",
      state: { status: "pending" },
    },
    {
      name: "Accepted bookings",
      count: stats?.acceptedBookings || 0,
      color: "#FAFAD2",
      href: "/bookings",
      state: { status: "accepted" },
    },
    {
      name: "Cancelled bookings",
      count: stats?.cancelledBookings || 0,
      color: "#E6E6FA",
      href: "/bookings",
      state: { status: "cancelled" },
    },
  ];

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  return (
    <div className="mt-2">
      {!isFetching && (
        <div className="grid md:grid-cols-4  grid-cols-2 gap-4">
          {dataList?.map((item, index) => (
            <DashboardItem
              key={item.name}
              name={item.name}
              count={item?.count || 0}
              color={item?.color || "#fff"}
              index={index}
              href={item.href}
              state={item.state}
            />
          ))}
        </div>
      )}
      {isFetching && <PageLoadingSpinner />}
    </div>
  );

  // return <WorkInProgress />;
}

export default Home;
