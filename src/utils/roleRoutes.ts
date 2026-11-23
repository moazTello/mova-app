import { Href } from 'expo-router';
import { User } from '@/types/user';

/** هل لازم المستخدم يتحقق من رقمه قبل ما يكمل؟ */
export function needsPhoneVerification(user: User) {
  return !!user.phone_number && !user.phone_number_verified;
}

/** الوجهة الصحيحة للمستخدم حسب دوره وحالته */
export function homeFor(user: User): Href {
  if (needsPhoneVerification(user)) {
    return { pathname: '/verify-otp', params: { phone: user.phone_number ?? '' } };
  }

  if (user.role === 'customer') return '/home';

  // التاجر والآدمن: لازم يكون عندهم متجر مقبول
  const info = user.seller_info;
  if (!info) return '/seller/onboarding';
  if (info.approval_status !== 'approved') return '/seller/status';

  return '/seller';
}