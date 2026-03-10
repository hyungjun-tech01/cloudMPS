import Image from 'next/image';
import mainImage from '@/app/images/mainImage.png';
import getDictionary from '@/app/libs/dictionaries';
import HomeForm from '@/app/components/home-form';
import { Box, Typography, Stack } from '@mui/material';

export default async function Page(
  props: {
    params: Promise<{ locale: "ko" | "en" }>;
  }) {
  const params = await props.params;
  const trans = await getDictionary(params.locale);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Box
        id="header"
        sx={{
          pt: 10,
          pb: 8,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'primary.main',
        }}
      >
        <Box id="logo" sx={{ mb: 3 }}>
          <Image
            src="/cloudMpsLogo.png"
            width={100}
            height={70}
            alt='Cloud MPS Logo'
          />
        </Box>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 5, color: '#f8fafc' }}>
          Cloud MPS
        </Typography>
        <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#e2e8f0' }}>{trans.home.intro}</Typography>
          <Typography variant="h6" sx={{ color: '#e2e8f0' }}>{trans.home.doc}</Typography>
        </Stack>
        <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
          <HomeForm trans={trans.home} />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'center', bgcolor: 'primary.dark', py: 6 }}>
        <Box id="mainImage" sx={{ width: '100%', maxWidth: 800, px: 2 }}>
          <Image
            src={mainImage}
            alt='Improve your business with Cloud MPS'
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Box>
      </Box>
      <Box sx={{ minHeight: 256, display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default', py: 8, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center', color: 'text.primary' }}>
          {trans.home.message_1}
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', mb: 1, fontWeight: 400 }}>
          {trans.home.message_2}
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 400 }}>
          {trans.home.message_3}
        </Typography>
      </Box>
    </Box>
  );
}
