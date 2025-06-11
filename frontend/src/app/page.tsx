'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  Card,
  CardMedia,
  CardContent,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

// API 기본 설정
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 메인 컴포넌트
export default function Home() {
  const router = useRouter();
  const [tabValue, setTabValue] = React.useState(0);
  const [worries, setWorries] = React.useState<Array<{
    id: number;
    nickname: string;
    password: string;
    category: string;
    content: string;
    createdAt: string;
    responses: Array<{
      id: number;
      content: string;
      createdAt: string;
    }>;
  }>>([]);
  const [checkWorryOpen, setCheckWorryOpen] = React.useState(false);
  const [checkWorryForm, setCheckWorryForm] = React.useState({
    nickname: '',
    password: '',
  });
  const [checkWorryError, setCheckWorryError] = React.useState('');
  const [myWorries, setMyWorries] = React.useState<Array<typeof worries[0]>>([]);
  const [isVolunteer, setIsVolunteer] = React.useState(false);
  const [volunteerLoginOpen, setVolunteerLoginOpen] = React.useState(false);
  const [volunteerLoginForm, setVolunteerLoginForm] = React.useState({
    username: '',
    password: '',
  });
  const [volunteerLoginError, setVolunteerLoginError] = React.useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogoClick = () => {
    setTabValue(0);
    // 로그아웃 처리
    if (isVolunteer) {
      setIsVolunteer(false);
      setWorries([]); // 고민 목록 초기화
      localStorage.removeItem('token');
      localStorage.removeItem('volunteer');
    }
    // 고민 확인 로그아웃 처리
    if (myWorries.length > 0) {
      setMyWorries([]);
    }
  };

  const handleCheckWorry = async () => {
    setCheckWorryError('');
    if (!checkWorryForm.nickname || !checkWorryForm.password) {
      setCheckWorryError('닉네임과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await api.get('/worries/check', {
        params: {
          nickname: checkWorryForm.nickname,
          password: checkWorryForm.password,
        },
      });

      setMyWorries(response.data);
      setCheckWorryOpen(false);
      setTabValue(1);
    } catch (error) {
      setCheckWorryError('일치하는 고민을 찾을 수 없습니다.');
    }
  };

  const handleVolunteerLogin = async () => {
    setVolunteerLoginError('');
    if (!volunteerLoginForm.username || !volunteerLoginForm.password) {
      setVolunteerLoginError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        username: volunteerLoginForm.username,
        password: volunteerLoginForm.password,
      });

      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('volunteer', JSON.stringify(response.data));
        setIsVolunteer(true);
        setVolunteerLoginOpen(false);
        setTabValue(1);

        // 고민 목록 가져오기
        try {
          const worriesResponse = await api.get('/worries', {
            headers: {
              'Authorization': `Bearer ${response.data.token}`,
            },
          });
          setWorries(worriesResponse.data);
        } catch (error) {
          console.error('고민 목록을 가져오는데 실패했습니다:', error);
        }
      } else {
        setVolunteerLoginError('로그인에 실패했습니다.');
      }
    } catch (error) {
      setVolunteerLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleVolunteerLogout = () => {
    setIsVolunteer(false);
    setTabValue(0);
  };

  const categories = [
    { id: 'career', name: '취업' },
    { id: 'love', name: '연애' },
    { id: 'life', name: '생활' },
    { id: 'study', name: '학업' },
    { id: 'etc', name: '기타' }
  ];

  // WriteWorryTab 컴포넌트
  const WriteWorryTab = () => {
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [formData, setFormData] = React.useState({
      nickname: '',
      password: '',
      content: '',
    });
    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setError('');
    };

    const handleSubmit = async () => {
      setError('');
      if (!formData.nickname || !formData.password || !formData.content || !selectedCategory) {
        setError('모든 필드를 입력해주세요.');
        return;
      }

      try {
        const response = await api.post('/worries', {
          nickname: formData.nickname,
          password: formData.password,
          category: selectedCategory,
          content: formData.content,
        });

        alert('고민이 성공적으로 저장되었습니다.');
        
        // 폼 초기화
        setFormData({
          nickname: '',
          password: '',
          content: '',
        });
        setSelectedCategory('');
      } catch (error) {
        setError('고민 저장 중 오류가 발생했습니다.');
      }
    };

    return (
      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            익명으로 고민을 남기고 봉사자들의 따뜻한 답장을 받아보세요.
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: '#e65100' }}>
              닉네임
            </Typography>
            <TextField
              fullWidth
              label="닉네임"
              name="nickname"
              variant="outlined"
              value={formData.nickname}
              onChange={handleChange}
              sx={{ mb: 3 }}
              placeholder="답장을 확인할 때 사용할 닉네임을 입력해주세요"
            />
            <Typography variant="subtitle1" sx={{ mb: 2, color: '#e65100' }}>
              고민 종류
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "contained" : "outlined"}
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    bgcolor: selectedCategory === category.id ? '#ff7043' : 'transparent',
                    color: selectedCategory === category.id ? 'white' : '#e65100',
                    borderColor: '#ff7043',
                    '&:hover': {
                      bgcolor: selectedCategory === category.id ? '#f4511e' : '#fff3e0',
                      borderColor: '#f4511e',
                    },
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </Box>
            <TextField
              fullWidth
              label="비밀번호"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              placeholder="답장을 확인할 때 사용할 비밀번호를 입력해주세요"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name="content"
              placeholder="당신의 고민을 자유롭게 적어주세요..."
              variant="outlined"
              value={formData.content}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                bgcolor: '#ff7043',
                '&:hover': {
                  bgcolor: '#f4511e',
                },
              }}
              size="large"
              startIcon={<EmailIcon />}
              fullWidth
            >
              고민 보내기
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  };

  // VolunteersTab 컴포넌트
  const VolunteersTab = ({ 
    myWorries, 
    isVolunteer,
    volunteerLoginForm,
    worries 
  }: { 
    myWorries: Array<{
      id: number;
      nickname: string;
      category: string;
      content: string;
      createdAt: string;
      responses: Array<{
        id: number;
        content: string;
        createdAt: string;
      }>;
    }>;
    isVolunteer: boolean;
    volunteerLoginForm: {
      username: string;
      password: string;
    };
    worries: Array<{
      id: number;
      nickname: string;
      category: string;
      content: string;
      createdAt: string;
      responses: Array<{
        id: number;
        content: string;
        createdAt: string;
      }>;
    }>;
  }) => {
    const [selectedStatus, setSelectedStatus] = React.useState('all');
    const [responseText, setResponseText] = React.useState('');
    const [error, setError] = React.useState('');
    const [selectedWorryId, setSelectedWorryId] = React.useState<number | null>(null);
    const [expandedWorryId, setExpandedWorryId] = React.useState<number | null>(null);

    const statuses = [
      { id: 'all', name: '전체' },
      { id: 'ongoing', name: '진행 중' },
      { id: 'completed', name: '완료' }
    ];

    const handleResponseSubmit = async () => {
      setError('');
      if (!responseText.trim()) {
        setError('답변 내용을 입력해주세요.');
        return;
      }

      if (!selectedWorryId) {
        setError('답변할 고민을 선택해주세요.');
        return;
      }

      // 즉시 UI 업데이트를 위한 임시 응답 객체 생성
      const tempResponse = {
        id: Date.now(), // 임시 ID
        content: responseText,
        createdAt: new Date().toISOString()
      };

      try {
        // 로컬 상태에 즉시 반영
        if (myWorries.length > 0) {
          // 내 고민 확인 탭인 경우
          setMyWorries(prev => 
            prev.map(worry => 
              worry.id === selectedWorryId 
                ? { ...worry, responses: [...worry.responses, tempResponse] } 
                : worry
            )
          );
        } else {
          // 봉사자 답변 탭인 경우
          setWorries(prev => 
            prev.map(worry => 
              worry.id === selectedWorryId 
                ? { ...worry, responses: [...worry.responses, tempResponse] } 
                : worry
            )
          );
        }

        // 서버에 저장 요청
        const response = await api.post(`/worries/${selectedWorryId}/responses`, {
          content: responseText,
        }, {
          headers: {
            'Authorization': `Basic ${btoa(`${volunteerLoginForm.username}:${volunteerLoginForm.password}`)}`,
          },
        });

        // 서버 응답으로 상태 업데이트 (임시 ID를 실제 ID로 교체)
        if (myWorries.length > 0) {
          setMyWorries(prev => 
            prev.map(worry => 
              worry.id === selectedWorryId 
                ? { 
                    ...worry, 
                    responses: worry.responses.map(r => 
                      r.id === tempResponse.id ? response.data : r
                    ) 
                  } 
                : worry
            )
          );
        } else {
          setWorries(prev => 
            prev.map(worry => 
              worry.id === selectedWorryId 
                ? { 
                    ...worry, 
                    responses: worry.responses.map(r => 
                      r.id === tempResponse.id ? response.data : r
                    ) 
                  } 
                : worry
            )
          );
        }

        // 상태 초기화
        setResponseText('');
        setSelectedWorryId(null);
        setExpandedWorryId(selectedWorryId); // 해당 고민 펼치기
      } catch (error) {
        console.error('답변 저장 오류:', error);
        setError('답변 저장 중 오류가 발생했습니다.');
        
        // 오류 발생 시 임시로 추가했던 답변 제거
        if (myWorries.length > 0) {
          setMyWorries(prev => 
            prev.map(worry => 
              worry.id === selectedWorryId 
                ? { 
                    ...worry, 
                    responses: worry.responses.filter(r => r.id !== tempResponse.id) 
                  } 
                : worry
            )
          );
        } else {
          setWorries(prev => 
            prev.map(worry => 
              worry.id === selectedWorryId 
                ? { 
                    ...worry, 
                    responses: worry.responses.filter(r => r.id !== tempResponse.id) 
                  } 
                : worry
            )
          );
        }
      }
    };

    const filteredWorries = myWorries.length > 0 ? myWorries : (Array.isArray(worries) ? worries.filter(worry => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'ongoing') return worry.responses.length === 0;
      if (selectedStatus === 'completed') return worry.responses.length > 0;
      return true;
    }) : []);

    return (
      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {myWorries.length > 0 
              ? '내 고민 확인' 
              : isVolunteer 
                ? '고민 답변하기' 
                : ''}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {myWorries.length > 0 
              ? '내가 작성한 고민과 답변을 확인하세요.'
              : isVolunteer
                ? '고민자들의 고민에 답변을 작성해주세요.'
                : '고민 답변에 대한 답변 현황입니다. 봉사자들의 답장을 확인해보세요.'}
          </Typography>
          <Paper sx={{ p: 3 }}>
            {myWorries.length === 0 && isVolunteer && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2, color: '#e65100' }}>
                  매칭 상태
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {statuses.map((status) => (
                    <Button
                      key={status.id}
                      variant={selectedStatus === status.id ? "contained" : "outlined"}
                      onClick={() => setSelectedStatus(status.id)}
                      sx={{
                        bgcolor: selectedStatus === status.id ? '#ff7043' : 'transparent',
                        color: selectedStatus === status.id ? 'white' : '#e65100',
                        borderColor: '#ff7043',
                        '&:hover': {
                          bgcolor: selectedStatus === status.id ? '#f4511e' : '#fff3e0',
                          borderColor: '#f4511e',
                        },
                      }}
                    >
                      {status.name}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: '#e65100' }}>
                    답변 작성
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="답변 내용을 입력해주세요..."
                    variant="outlined"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleResponseSubmit}
                    sx={{
                      bgcolor: '#ff7043',
                      '&:hover': {
                        bgcolor: '#f4511e',
                      },
                    }}
                    startIcon={<EmailIcon />}
                    fullWidth
                  >
                    답변 제출
                  </Button>
                </Box>
              </>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredWorries.map((worry) => (
                <Card key={worry.id} sx={{
                  display: 'flex',
                  p: 2,
                  '&:hover': {
                    bgcolor: '#fff3e0',
                  }
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => setExpandedWorryId(expandedWorryId === worry.id ? null : worry.id)}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {worry.nickname}님의 고민
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          카테고리: {categories.find(c => c.id === worry.category)?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          작성일: {new Date(worry.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Button
                        variant="text"
                        sx={{
                          color: '#e65100',
                          '&:hover': {
                            bgcolor: '#fff3e0',
                          },
                        }}
                      >
                        {expandedWorryId === worry.id ? '접기' : '자세히 보기'}
                      </Button>
                    </Box>
                    {expandedWorryId === worry.id && (
                      <>
                        <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                          {worry.content}
                        </Typography>
                        {worry.responses.length > 0 && (
                          <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #ff7043' }}>
                            <Typography variant="subtitle2" color="#ff7043">
                              답변:
                            </Typography>
                            {worry.responses.map(response => (
                              <Typography key={response.id} variant="body2" sx={{ mt: 1 }}>
                                {response.content}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                  {myWorries.length === 0 && isVolunteer && (
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedWorryId(worry.id)}
                      sx={{
                        color: '#e65100',
                        borderColor: '#ff7043',
                        '&:hover': {
                          borderColor: '#f4511e',
                          bgcolor: '#fff3e0',
                        },
                      }}
                    >
                      답변하기
                    </Button>
                  )}
                </Card>
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  };

  // CounselingTab 컴포넌트
  const CounselingTab = () => (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          전문 상담사와 1:1 상담을 통해 더 깊이 있는 도움을 받아보세요. 전화번호 입력이 필요합니다.
        </Typography>
        <Paper sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="이름"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="연락처"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="상담 내용"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#ff7043',
              '&:hover': {
                bgcolor: '#f4511e',
              },
            }}
            size="large"
            fullWidth
          >
            상담 신청하기
          </Button>
        </Paper>
      </Box>
    </Container>
  );

  const sections = [
    {
      title: '고민 우체국이란?',
      description: '익명으로 고민을 남기고 봉사자들의 답장을 받아보세요.',
      image: 'https://plus.unsplash.com/premium_photo-1679768606092-5043ce780f8d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      path: '/write'
    },
    {
      title: '익명성 보장',
      description: '상담자는 로그인이 필요없고 본인이 정한 닉네임과 비밀번호만으로 고민을 남길 수 있습니다.',
      image: 'https://plus.unsplash.com/premium_photo-1674506652851-1f8426f4ac39?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: <VolunteerActivismIcon sx={{ fontSize: 32 }} />,
      path: '/volunteers'
    },
    {
      title: '프로젝트 정보',
      description: '가톨릭대학교 키스톤 아이들 조에서 기획하고 제작된 프로젝트입니다.',
      image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fcafefiles.naver.net%2FMjAxOTEwMjdfMjkw%2FMDAxNTcyMTA3NTc0MTQ3.EikIJyVsX_nl-PgAh6gCIqd-oo76rjhqBwiiWZDmo7Eg.m6ihl1TJPP2PHjZQ-glT_mM8p7aWWFnMwURipNQjJckg.PNG%2F%25BE%25C6%25B8%25E0.png&type=a340',
      icon: <LocalPostOfficeIcon sx={{ fontSize: 32 }} />,
      path: '#' // 특정 페이지로 이동하지 않으면 #으로 설정
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#ff7043' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={handleLogoClick}
          >
            <LocalPostOfficeIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6" component="div">
              고민우체국
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {!isVolunteer && (
            <Button
              color="inherit"
              onClick={() => setCheckWorryOpen(true)}
              sx={{
                mr: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              고민 확인
            </Button>
          )}
          {isVolunteer ? (
            <Button
              color="inherit"
              onClick={handleVolunteerLogout}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              봉사자 로그아웃
            </Button>
          ) : myWorries.length === 0 && (
            <Button
              color="inherit"
              onClick={() => setVolunteerLoginOpen(true)}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              봉사자 로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 봉사자 로그인 다이얼로그 */}
      <Dialog 
        open={volunteerLoginOpen} 
        onClose={() => setVolunteerLoginOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#e65100' }}>
          봉사자 로그인
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              봉사자 계정으로 로그인하여 고민에 답변하세요.
            </Typography>
            <TextField
              fullWidth
              label="아이디"
              value={volunteerLoginForm.username}
              onChange={(e) => setVolunteerLoginForm(prev => ({ ...prev, username: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={volunteerLoginForm.password}
              onChange={(e) => setVolunteerLoginForm(prev => ({ ...prev, password: e.target.value }))}
              sx={{ mb: 2 }}
            />
            {volunteerLoginError && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {volunteerLoginError}
              </Typography>
            )}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                component="a"
                href="/register"
                sx={{
                  color: '#e65100',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                계정이 없으신가요? 회원가입
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setVolunteerLoginOpen(false)}
            sx={{ color: '#e65100' }}
          >
            취소
          </Button>
          <Button 
            onClick={handleVolunteerLogin}
            variant="contained"
            sx={{
              bgcolor: '#ff7043',
              '&:hover': {
                bgcolor: '#f4511e',
              },
            }}
          >
            로그인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 고민 확인 다이얼로그 */}
      <Dialog 
        open={checkWorryOpen} 
        onClose={() => setCheckWorryOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#e65100' }}>
          고민 확인하기
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              닉네임과 비밀번호를 입력하여 본인의 고민을 확인하세요.
            </Typography>
            <TextField
              fullWidth
              label="닉네임"
              value={checkWorryForm.nickname}
              onChange={(e) => setCheckWorryForm(prev => ({ ...prev, nickname: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={checkWorryForm.password}
              onChange={(e) => setCheckWorryForm(prev => ({ ...prev, password: e.target.value }))}
              sx={{ mb: 2 }}
            />
            {checkWorryError && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {checkWorryError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setCheckWorryOpen(false)}
            sx={{ color: '#e65100' }}
          >
            취소
          </Button>
          <Button 
            onClick={handleCheckWorry}
            variant="contained"
            sx={{
              bgcolor: '#ff7043',
              '&:hover': {
                bgcolor: '#f4511e',
              },
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '100%', bgcolor: '#fff3e0' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              color: '#e65100',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              minWidth: 0,
              flex: 1,
              '&.Mui-selected': {
                color: '#d84315',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#d84315',
              height: 3,
            },
          }}
        >
          <Tab label="고민 작성하기" />
          <Tab label={isVolunteer ? "고민 답변하기" : "고민 답변 확인"} />
          <Tab label="전문 상담 신청" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && !isVolunteer && <WriteWorryTab />}
          {tabValue === 1 && <VolunteersTab myWorries={myWorries} isVolunteer={isVolunteer} volunteerLoginForm={volunteerLoginForm} worries={worries} />}
          {tabValue === 2 && !isVolunteer && <CounselingTab />}
        </Box>
      </Box>

      <Box sx={{ bgcolor: '#fff3e0', py: 4 }}>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="#e65100"
            gutterBottom
          >
            고민우체국
          </Typography>
          <Typography variant="h6" align="center" color="#bf360c" paragraph>
            익명으로 고민을 남기고, 봉사자들의 답장을 받아보세요.
            당신의 이야기를 들어주는 따뜻한 공간입니다.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {sections.map((section, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'default',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(255, 112, 67, 0.2)',
                      },
                      border: '1px solid #fff3e0',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={180}
                      image={section.image}
                      alt={section.title}
                      sx={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {section.icon}
                        <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                          {section.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {section.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
