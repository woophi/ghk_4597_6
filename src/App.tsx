import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Gap } from '@alfalab/core-components/gap';
import { Input } from '@alfalab/core-components/input';
import { Tag } from '@alfalab/core-components/tag';
import { Typography } from '@alfalab/core-components/typography';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import rubIcon from './assets/rub.png';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';
import { ThxSpinner } from './thx/ThxLayout';
import { sendDataToGA } from './utils/events';

const min = 2000;
const max = 3_000_000;

const chips = [10_000, 36_000, 50_000, 72_000];

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sum, setSum] = useState<string>('2000');
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
