# Internationalization (i18n)

The app is configured to support multiple languages using `next-intl`.

## Supported Languages

- **English (en)**: Default language (LTR)
- **Hebrew (he)**: Ready for future use (RTL)

## Current Implementation

Currently, all UI text is hardcoded in English. The i18n infrastructure is in place and ready to be activated when needed.

## Activating Translations

To activate translations in the app:

1. **Update next.config.js**: Already configured with next-intl plugin
2. **Add locale to URLs**: Modify middleware to handle locale routing
3. **Replace hardcoded strings**: Update components to use translation keys

### Example Component Update

Before:
```tsx
<Button>Create Event</Button>
```

After:
```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('events');
  return <Button>{t('create')}</Button>;
}
```

### Server Components

For server components:
```tsx
import { getTranslations } from 'next-intl/server';

async function MyServerComponent() {
  const t = await getTranslations('events');
  return <Button>{t('create')}</Button>;
}
```

## Adding New Translations

1. Add the translation key to `src/i18n/messages/en.json`
2. Add the Hebrew translation to `src/i18n/messages/he.json`
3. Use the translation in your component

## RTL Support

Hebrew language includes RTL (right-to-left) support. When activated:

- Text direction automatically switches
- Layout mirrors appropriately
- Tailwind CSS handles RTL variants automatically

## Locale Switching

To add a language switcher:

```tsx
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (locale: string) => {
    router.push(`/${locale}${pathname}`);
  };

  return (
    <select onChange={(e) => switchLocale(e.target.value)}>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {localeNames[locale]}
        </option>
      ))}
    </select>
  );
}
```

## Future Enhancements

- Date/time formatting based on locale
- Number formatting
- Pluralization rules
- Additional languages (Arabic, Spanish, etc.)
