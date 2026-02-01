"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ShieldX, Loader2, Users, Search, ChevronDown, ChevronUp, Video, Image as ImageIcon, Play } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SortField = "name" | "email" | "credits" | "createdAt";
type SortOrder = "asc" | "desc";
type SubscriptionFilter = "all" | "subscribed" | "free";
type AdminFilter = "all" | "admin" | "non-admin";

type SelectedUser = {
  _id: Id<"users">;
  name: string;
  email?: string;
  credits: number;
  subscriptionProductId?: string;
  isAdmin?: boolean;
  _creationTime: number;
} | null;

export default function AdminPage() {
  const user = useQuery(api.user.getUser);
  const allUsers = useQuery(
    api.admin.getAllUsersForAdmin,
    user?.isAdmin ? {} : "skip"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionFilter>("all");
  const [adminFilter, setAdminFilter] = useState<AdminFilter>("all");
  const [selectedUser, setSelectedUser] = useState<SelectedUser>(null);

  // Fetch videos and ads for the selected user
  const userVideos = useQuery(
    api.admin.getUserVideosForAdmin,
    selectedUser ? { userId: selectedUser._id } : "skip"
  );
  const userAds = useQuery(
    api.admin.getUserAdsForAdmin,
    selectedUser ? { userId: selectedUser._id } : "skip"
  );

  const filteredAndSortedUsers = useMemo(() => {
    if (!allUsers) return [];

    const filtered = allUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesSubscription =
        subscriptionFilter === "all" ||
        (subscriptionFilter === "subscribed" && u.subscriptionProductId) ||
        (subscriptionFilter === "free" && !u.subscriptionProductId);

      const matchesAdmin =
        adminFilter === "all" ||
        (adminFilter === "admin" && u.isAdmin) ||
        (adminFilter === "non-admin" && !u.isAdmin);

      return matchesSearch && matchesSubscription && matchesAdmin;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "email":
          comparison = (a.email ?? "").localeCompare(b.email ?? "");
          break;
        case "credits":
          comparison = a.credits - b.credits;
          break;
        case "createdAt":
          comparison = a._creationTime - b._creationTime;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [allUsers, searchQuery, sortField, sortOrder, subscriptionFilter, adminFilter]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Loading state
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Access denied for non-admin users
  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldX className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  // Admin content
  return (
    <div className="max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      {/* Users Section */}
      <div className="p-6 bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl shadow-md border border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-white">
            Users ({allUsers?.length ?? 0})
          </h2>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Subscription Filter */}
          <Select
            value={subscriptionFilter}
            onValueChange={(value) => setSubscriptionFilter(value as SubscriptionFilter)}
          >
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E1E2D] border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Users</SelectItem>
              <SelectItem value="subscribed" className="text-white hover:bg-white/10">Subscribed</SelectItem>
              <SelectItem value="free" className="text-white hover:bg-white/10">Free</SelectItem>
            </SelectContent>
          </Select>

          {/* Admin Filter */}
          <Select
            value={adminFilter}
            onValueChange={(value) => setAdminFilter(value as AdminFilter)}
          >
            <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E1E2D] border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Roles</SelectItem>
              <SelectItem value="admin" className="text-white hover:bg-white/10">Admin</SelectItem>
              <SelectItem value="non-admin" className="text-white hover:bg-white/10">Non-Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <div className="flex gap-2">
            <Select
              value={sortField}
              onValueChange={(value) => setSortField(value as SortField)}
            >
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E2D] border-white/10">
                <SelectItem value="createdAt" className="text-white hover:bg-white/10">Date Joined</SelectItem>
                <SelectItem value="name" className="text-white hover:bg-white/10">Name</SelectItem>
                <SelectItem value="email" className="text-white hover:bg-white/10">Email</SelectItem>
                <SelectItem value="credits" className="text-white hover:bg-white/10">Credits</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={toggleSortOrder}
              className="p-2 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Users List */}
        {allUsers === undefined ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {searchQuery || subscriptionFilter !== "all" || adminFilter !== "all"
              ? "No users match your filters"
              : "No users found"}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium truncate">{u.name}</h3>
                      {u.isAdmin && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-500">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm truncate">
                      {u.email ?? "No email"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-400">Credits</p>
                      <p className="text-white font-medium">{u.credits}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-400">Status</p>
                      <p
                        className={
                          u.subscriptionProductId
                            ? "text-green-400 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {u.subscriptionProductId ? "Subscribed" : "Free"}
                      </p>
                    </div>

                    <div className="text-center hidden md:block">
                      <p className="text-gray-400">Joined</p>
                      <p className="text-white text-sm">
                        {new Date(u._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="bg-[#1E1E2D] border-white/10 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <span>{selectedUser?.name}</span>
              {selectedUser?.isAdmin && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-500">
                  Admin
                </span>
              )}
            </DialogTitle>
            <p className="text-gray-400 text-sm">{selectedUser?.email ?? "No email"}</p>
          </DialogHeader>

          {/* User Stats */}
          <div className="flex gap-4 py-4 border-b border-white/10">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Credits</p>
              <p className="text-white font-medium text-lg">{selectedUser?.credits}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Status</p>
              <p className={selectedUser?.subscriptionProductId ? "text-green-400 font-medium" : "text-gray-500"}>
                {selectedUser?.subscriptionProductId ? "Subscribed" : "Free"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Joined</p>
              <p className="text-white text-sm">
                {selectedUser?._creationTime && new Date(selectedUser._creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Videos Section */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Video className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-medium">
                Videos ({userVideos?.length ?? 0})
              </h3>
            </div>

            {userVideos === undefined ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : userVideos.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No videos created</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {userVideos.map((video) => (
                  <div
                    key={video._id}
                    className="rounded-lg bg-white/5 border border-white/10 overflow-hidden"
                  >
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title ?? "Video thumbnail"}
                        width={200}
                        height={120}
                        className="w-full h-24 object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-24 bg-white/10 flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-white text-xs truncate">
                        {video.title ?? video.prompt.slice(0, 30) + "..."}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-500 text-xs">{video.style}</span>
                        {video.videoUrl && (
                          <Link href={video.videoUrl} target="_blank">
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Play className="h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ads Section */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-purple-400" />
              <h3 className="text-white font-medium">
                Ads ({userAds?.length ?? 0})
              </h3>
            </div>

            {userAds === undefined ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : userAds.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No ads created</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {userAds.map((ad) => (
                  <div
                    key={ad._id}
                    className="rounded-lg bg-white/5 border border-white/10 overflow-hidden"
                  >
                    {ad.adImageUrl ? (
                      <Image
                        src={ad.adImageUrl}
                        alt={ad.description ?? "Ad image"}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-32 bg-white/10 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                    <div className="p-2 flex items-center justify-between">
                      {ad.adImageUrl && (
                        <Link href={ad.adImageUrl} target="_blank">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            View
                          </Button>
                        </Link>
                      )}
                      {ad.adVideoUrl && (
                        <Link href={ad.adVideoUrl} target="_blank">
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Play className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
