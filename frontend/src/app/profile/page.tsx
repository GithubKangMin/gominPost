'use client';

import { useEffect, useState, useRef } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { Profile, ProfileError } from '@/types/profile';
import { Post } from '@/types';
import { getProfile, updateProfile, getUserPosts } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<ProfileError | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({
    nickname: '',
    currentPassword: '',
    newPassword: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setEditForm({ 
          nickname: data.nickname,
          currentPassword: '',
          newPassword: '',
          imageFile: null,
        });
        setPreviewImage(data.imageUrl || null);
      } catch (error) {
        console.error('프로필 로딩 실패:', error);
        setError({ message: '프로필을 불러오는데 실패했습니다.' });
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserPosts(currentPage);
        setPosts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('게시물 로딩 실패:', error);
      }
    };

    if (profile) {
      fetchPosts();
    }
  }, [profile, currentPage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        setError({ message: '이미지 크기는 5MB를 초과할 수 없습니다.', field: 'image' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setEditForm(prev => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if ((editForm.currentPassword && !editForm.newPassword) || 
          (!editForm.currentPassword && editForm.newPassword)) {
        setError({ 
          message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.',
          field: 'password'
        });
        return;
      }

      const updatedProfile = await updateProfile({
        nickname: editForm.nickname,
        currentPassword: editForm.currentPassword,
        newPassword: editForm.newPassword,
        imageFile: editForm.imageFile || undefined,
      });
      
      setProfile(updatedProfile);
      setIsEditing(false);
      setEditForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        imageFile: null,
      }));
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      setError({ message: '프로필 업데이트에 실패했습니다.' });
    }
  };

  if (!profile) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">프로필</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error.message}</p>
        </div>
      )}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative w-24 h-24">
              <Image
                src={previewImage || '/default-profile.png'}
                alt="프로필 이미지"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                이미지 변경
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">닉네임</label>
            <input
              type="text"
              value={editForm.nickname}
              onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">비밀번호 변경</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
              <input
                type="password"
                value={editForm.currentPassword}
                onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
              <input
                type="password"
                value={editForm.newPassword}
                onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
                setEditForm({
                  nickname: profile.nickname,
                  currentPassword: '',
                  newPassword: '',
                  imageFile: null,
                });
                setPreviewImage(profile.imageUrl || null);
              }}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={profile.imageUrl || '/default-profile.png'}
                alt="프로필 이미지"
                fill
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">이메일</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">닉네임</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.nickname}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">가입일</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
          <div className="mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              프로필 수정
            </button>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">내 게시물</h2>
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <Link 
                  href={`/posts/${post.slug}`} 
                  key={post.id}
                  className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === i 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">아직 작성한 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
} 