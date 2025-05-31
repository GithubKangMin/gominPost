'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

// 고민 작성 탭 컴포넌트
const WriteWorryTab = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [formData, setFormData] = React.useState({
    nickname: '',
    password: '',
    content: '',
  });
  const [error, setError] = React.useState('');

  const categories = [
    { id: 'career', name: '취업' },
    { id: 'love', name: '연애' },
    { id: 'life', name: '생활' },
    { id: 'study', name: '학업' },
    { id: 'etc', name: '기타' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.nickname || !formData.password || !formData.content || !selectedCategory) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/worries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category: selectedCategory,
        }),
      });

      if (response.ok) {
        const createdWorry = await response.json();
        console.log('고민 작성 성공:', createdWorry);
        alert('고민이 성공적으로 저장되었습니다.'); // 성공 시에는 alert 유지
        // 폼 초기화
        setFormData({
          nickname: '',
          password: '',
          content: '',
        });
        setSelectedCategory('');
      } else {
        const errorData = await response.json();
        console.error('고민 작성 실패:', errorData);
        setError('고민 작성 실패: ' + (errorData.message || response.statusText));
      }
    } catch (error) {
      console.error('고민 작성 중 오류 발생:', error);
      setError('고민 작성 중 오류 발생');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          고민 작성하기
        </Typography>
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

// 봉사자 편지 매칭 현황 탭 컴포넌트
const VolunteersTab = () => {
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [responseText, setResponseText] = React.useState('');
  const [error, setError] = React.useState('');
  // TODO: 실제 애플리케이션에서는 로그인 후 저장된 봉사자 ID를 가져와야 합니다.
  const volunteerId = 1; // 임시 봉사자 ID (숫자만 사용)
  // TODO: 어떤 고민에 답변할지 결정해야 합니다. 여기서는 예시로 첫 번째 고민에 답변한다고 가정합니다.
  const worryIdToRespond = 1; // 임시 고민 ID (숫자만 사용)

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

    try {
      const response = await fetch(`/api/responses/worry/${worryIdToRespond}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 봉사자 인증 정보 (예: 토큰)를 헤더에 추가해야 할 수 있습니다.
        },
        body: JSON.stringify({
          content: responseText,
          volunteerId: volunteerId, // 요청 본문에 봉사자 ID 포함
        }),
      });

      if (response.ok) {
        const createdResponse = await response.json();
        console.log('답변 작성 성공:', createdResponse);
        alert('답변이 성공적으로 저장되었습니다.'); // 성공 시에는 alert 유지
        setResponseText(''); // 입력 필드 초기화
        // TODO: 답변 목록 새로고침 또는 업데이트 로직 추가
      } else {
        const errorData = await response.json();
        console.error('답변 작성 실패:', errorData);
        setError('답변 작성 실패: ' + (errorData.message || response.statusText));
      }
    } catch (error) {
      console.error('답변 작성 중 오류 발생:', error);
      setError('답변 작성 중 오류 발생');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          고민 답변 확인
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          고민 답변에 대한 답변 현황입니다. 봉사자들의 답장을 확인해보세요.
        </Typography>
        <Paper sx={{ p: 3 }}>
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
              답변 작성 (임시)
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{
              display: 'flex',
              p: 2,
              '&:hover': {
                bgcolor: '#fff3e0',
              }
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  김초코 봉사자와의 편지
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  박딸기 고민자
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  마지막 편지: 2024.03.15
                </Typography>
                <Typography variant="body2" color="#ff7043" sx={{ mt: 1 }}>
                  진행 중
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  color: '#e65100',
                  borderColor: '#ff7043',
                  '&:hover': {
                    borderColor: '#f4511e',
                    bgcolor: '#fff3e0',
                  },
                }}
              >
                편지 보기
              </Button>
            </Card>
            <Card sx={{
              display: 'flex',
              p: 2,
              '&:hover': {
                bgcolor: '#fff3e0',
              }
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  박녹차 봉사자와의 편지
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  바나나 고민자
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  마지막 편지: 2024.03.10
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  완료
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  color: '#e65100',
                  borderColor: '#ff7043',
                  '&:hover': {
                    borderColor: '#f4511e',
                    bgcolor: '#fff3e0',
                  },
                }}
              >
                편지 보기
              </Button>
            </Card>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

// 상담 신청 탭 컴포넌트
const CounselingTab = () => (
  <Container maxWidth="md">
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        전문 상담 신청
      </Typography>
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

// 메인 컴포넌트
export default function Home() {
  const router = useRouter();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogoClick = () => {
    setTabValue(0); // 고민 작성하기 탭으로 이동
  };

  const sections = [
    {
      title: '고민 우체국이란?',
      description: '익명으로 고민을 남기고 봉사자들의 답장을 받아보세요.',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f',
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      path: '/write'
    },
    {
      title: '익명성이 보장되나요?',
      description: '상담자는 로그인이 필요없고 본인이 정한 닉네임과 비밀번호만으로 고민을 남길 수 있습니다.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      icon: <VolunteerActivismIcon sx={{ fontSize: 32 }} />,
      path: '/volunteers'
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
          <Button
            color="inherit"
            onClick={() => router.push('/check')}
            sx={{
              mr: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            고민 확인
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push('/login')}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            봉사자 로그인
          </Button>
        </Toolbar>
      </AppBar>

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
          <Tab label="고민 답변 확인" />
          <Tab label="전문 상담 신청" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && <WriteWorryTab />}
          {tabValue === 1 && <VolunteersTab />}
          {tabValue === 2 && <CounselingTab />}
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
            익명으로 고민을 남기고, 봉사자들의 따뜻한 답장을 받아보세요.
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
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(255, 112, 67, 0.2)',
                      },
                      border: '1px solid #fff3e0',
                    }}
                    onClick={() => router.push(section.path)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
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
