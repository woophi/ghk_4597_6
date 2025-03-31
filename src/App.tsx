import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Gap } from '@alfalab/core-components/gap';
import { Input } from '@alfalab/core-components/input';
import { Tag } from '@alfalab/core-components/tag';
import { Typography } from '@alfalab/core-components/typography';
import { ChevronRightMIcon } from '@alfalab/icons-glyph/ChevronRightMIcon';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import rubIcon from './assets/rub.png';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';
import { ThxSpinner } from './thx/ThxLayout';
import { sendDataToGA } from './utils/events';

const min = 2000;
const max = 3_000_000;

const chips = [2000, 5000, 15000, 36000];

const addSome = 36_000;
const sduiLink =
  'alfabank://sdui_screen?screenName=InvestmentLongread&fromCurrent=true&endpoint=v1/invest-main-screen-view/investment-longread/45034%3flocation=AM%26campaignCode=GH';

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sum, setSum] = useState<string>('');
  const [thxShow, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const submit = () => {
    if (!sum) {
      setError('Введите сумму взноса');
      return;
    }

    setLoading(true);
    sendDataToGA({
      auto: 'None',
      sum: Number(sum),
      id: LS.getItem(LSKeys.UserId, 0) as number,
    }).then(() => {
      LS.setItem(LSKeys.ShowThx, true);
      setThx(true);
      setLoading(false);
    });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }

    setSum(e.target.value);
  };
  const handleBlurInput = () => {
    const value = Number(sum);

    if (value < min) {
      setSum('2000');
      return;
    }
    if (value > max) {
      setSum('3000000');
      return;
    }
  };

  const goToSdui = () => {
    window.gtag('event', 'inf_4597_var3');
    window.location.replace(sduiLink);
  };

  if (thxShow) {
    return <ThxSpinner />;
  }

  return (
    <>
      <div className={appSt.container}>
        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h1" view="medium" font="system" weight="semibold">
          Сумма взноса
        </Typography.TitleResponsive>

        <div>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            Счёт списания
          </Typography.Text>

          <div className={appSt.banner}>
            <img src={rubIcon} width={48} height={48} alt="rubIcon" />

            <Typography.Text view="primary-small" weight="medium">
              Текущий счёт
            </Typography.Text>
          </div>
        </div>

        <Input
          hint="От 2 000 до 3 000 000 ₽"
          type="number"
          min={min}
          max={max}
          label="Сумма взноса"
          error={error}
          value={sum}
          onChange={handleChangeInput}
          onBlur={handleBlurInput}
          block
          pattern="[0-9]*"
        />

        <div>
          <Swiper spaceBetween={12} slidesPerView="auto">
            {chips.map(chip => (
              <SwiperSlide key={chip} className={appSt.swSlide}>
                <Tag view="filled" size="xxs" shape="rectangular" onClick={() => setSum(String(chip))}>
                  {chip.toLocaleString('ru')} ₽
                </Tag>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={appSt.box} onClick={goToSdui}>
          <Typography.Text view="secondary-medium">
            {Number(sum) >= addSome ? (
              'Условия выполнены. После пополнения вам начислят кэшбэк в подарок'
            ) : sum ? (
              <>
                Пополните еще на <span style={{ fontWeight: 700 }}>{(addSome - Number(sum)).toLocaleString('ru')} ₽</span> –
                получите кэшбэк в подарок. Действует до 15.04
              </>
            ) : (
              <>
                Пополните на <span style={{ fontWeight: 700 }}>{addSome.toLocaleString('ru')}</span> – получите кэшбэк в
                подарок. Действует до 15.04
              </>
            )}
          </Typography.Text>

          <ChevronRightMIcon />
        </div>
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <ButtonMobile loading={loading} block view="primary" onClick={submit}>
          Продолжить
        </ButtonMobile>
      </div>
    </>
  );
};
