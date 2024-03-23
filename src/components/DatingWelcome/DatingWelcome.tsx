import { useContext, useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ConfigProvider, Radio, Slider } from 'antd'
import toast from 'react-hot-toast'

import HeightList from '~/components/HeightList'
import HometownList from '~/components/HometownList'
import LanguageList from '~/components/LanguageList'
import Loading from '~/components/Loading'
import { CreateDatingProfileReqBody, createDatingProfile } from '~/apis/datingUsers.apis'
import { CreateDatingCriteriaReqBody, createDatingCriteria } from '~/apis/datingCriterias.api'
import images from '~/assets/images'
import { Language, Sex } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { User } from '~/types/users.types'
import { DatingProfile } from '~/types/datingUsers.types'
import { calculateAge } from '~/utils/handle'
import { setDatingProfileToLS } from '~/utils/localStorage'

const TOTAL_PAGES = 7

function DatingWelcome() {
    const { user, setDatingProfile } = useContext(AppContext)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [profileData, setProfileData] = useState<CreateDatingProfileReqBody>({
        name: (user as User).name,
        age: calculateAge((user as User).date_of_birth),
        sex: (user as User).sex,
        height: 0,
        hometown: '',
        language: Language.Vietnamese
    })
    const [isOpenHeightList, setIsOpenHeightList] = useState<boolean>(false)
    const [isOpenProfileHometownList, setIsOpenProfileHometownList] = useState<boolean>(false)
    const [isOpenProfileLanguageList, setIsOpenProfileLanguageList] = useState<boolean>(false)
    const [criteriaData, setCriteriaData] = useState<CreateDatingCriteriaReqBody>({
        sex: Sex.Male,
        age_range: [18, 28],
        height_range: [150, 180],
        hometown: '',
        language: Language.Vietnamese
    })
    const [isOpenCriteriaHometownList, setIsOpenCriteriaHometownList] = useState<boolean>(false)
    const [isOpenCriteriaLanguageList, setIsOpenCriteriaLanguageList] = useState<boolean>(false)

    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const wrapper = wrapperRef.current

        if (wrapper) {
            wrapper.style.transform = `translateX(calc(-100% * ${(currentPage - 1) / TOTAL_PAGES}))`
        }
    }, [currentPage])

    const handleNextStep = () => {
        if (currentPage === 2) {
            if (!profileData.height || !profileData.hometown)
                return toast('Vui lòng điền đầy đủ thông tin', {
                    position: 'top-center'
                })
        }

        if (currentPage === 6) {
            if (!criteriaData.hometown)
                return toast('Vui lòng chọn quê quán của người mà bạn muốn hẹn hò', {
                    position: 'top-center'
                })
        }

        setCurrentPage((prevPage) => prevPage + 1)
    }

    const { mutateAsync: mutateCreateDatingProfile } = useMutation({
        mutationFn: (data: CreateDatingProfileReqBody) => createDatingProfile(data)
    })

    const { mutateAsync: mutateCreateDatingCriteria } = useMutation({
        mutationFn: (data: CreateDatingCriteriaReqBody) => createDatingCriteria(data)
    })

    const handleSubmit = async () => {
        setCurrentPage((prevPage) => prevPage + 1)

        const createProfileResponse = await mutateCreateDatingProfile(profileData)
        await mutateCreateDatingCriteria(criteriaData)
        const result = createProfileResponse.data.result as DatingProfile

        setDatingProfile(result)
        setDatingProfileToLS(result)
    }

    return (
        <>
            {currentPage > 1 && (
                <div className='absolute inset-x-0 top-0 mx-4 my-[26px]'>
                    <div className='box-content h-1 overflow-hidden rounded-full bg-[#e4e6eb]'>
                        <div
                            className='h-full w-0 bg-[#07e1ff] transition-all'
                            style={{ width: `${((currentPage - 2) * 100) / (TOTAL_PAGES - 1)}%` }}
                        />
                    </div>
                    <p className='mt-1 text-center text-[13px] leading-5'>
                        Đã hoàn thành {currentPage - 2 < 0 ? 0 : currentPage - 2}/{TOTAL_PAGES - 1} bước
                    </p>
                </div>
            )}

            <div
                ref={wrapperRef}
                className='flex h-full py-4 transition-all'
                style={{ width: `${TOTAL_PAGES * 100}%` }}
            >
                <div
                    className='flex flex-col justify-center overflow-y-auto p-4'
                    style={{ width: `${100 / TOTAL_PAGES}%` }}
                >
                    <div className='flex h-full flex-col items-center justify-center'>
                        <div className='aspect-[16/9] h-[200px] max-w-full'>
                            <img src={images.dating_heart} alt='heart' className='h-full w-full object-cover' />
                        </div>
                        <h1 className='text-center text-2xl font-bold'>Chào mừng bạn đến với Hẹn hò trên Nexus</h1>
                        <p className='mt-4 text-center text-sm'>
                            Đây là nơi để bạn tìm kiếm một nửa của mình. Hãy tạo hồ sơ để bắt đầu cuộc hẹn hò của bạn
                            ngay bây giờ.
                        </p>
                    </div>
                </div>

                <div
                    className='flex flex-col justify-center overflow-y-auto p-4'
                    style={{ width: `${100 / TOTAL_PAGES}%` }}
                >
                    <h2 className='text-center text-2xl font-semibold text-[#07e1ff]'>Tạo hồ sơ hẹn hò của bạn</h2>

                    <p className='mt-5 text-center text-sm'>
                        Bắt đầu bằng cách điền thông tin cơ bản về bạn. Hãy chắc chắn rằng thông tin của bạn là chính
                        xác.
                    </p>

                    <div className='mt-5'>
                        <div className='mt-3 flex items-center justify-between'>
                            <svg
                                className='h-[28px] w-[28px]'
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                                />
                            </svg>

                            <div className='mx-2 flex flex-[1] flex-col'>
                                <div className='text-[15px] font-medium'>Tên</div>
                                <p className='text-[13px] text-[#e4e6eb]/80'>{profileData.name}</p>
                            </div>
                        </div>

                        <div className='mt-3 flex items-center justify-between'>
                            <svg
                                className='h-[28px] w-[28px]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path
                                        d='M9.41763 18.5409C10.1913 17.3978 11.2839 16 12 16C12.7161 16 13.8087 17.3978 14.5824 18.5409C15.0129 19.1769 14.5438 20 13.7757 20H10.2243C9.45619 20 8.9871 19.1769 9.41763 18.5409Z'
                                        fill='currentColor'
                                    />
                                    <path
                                        d='M12 9C12.3511 9 12.9855 8.23437 13.5273 7.47668C13.9798 6.84397 13.5091 6 12.7313 6L11.2687 6C10.4909 6 10.0202 6.84397 10.4727 7.47668C11.0145 8.23437 11.6489 9 12 9Z'
                                        fill='currentColor'
                                    />
                                    <path
                                        fillRule='evenodd'
                                        clipRule='evenodd'
                                        d='M4 2C4 1.44772 4.44772 1 5 1H19C19.5523 1 20 1.44772 20 2C20 2.55228 19.5523 3 19 3H17.9726C17.8373 5.41131 17.21 7.23887 16.2903 8.7409C15.4882 10.0511 14.4804 11.0808 13.4874 12C14.4804 12.9192 15.4882 13.9489 16.2903 15.2591C17.21 16.7611 17.8373 18.5887 17.9726 21H19C19.5523 21 20 21.4477 20 22C20 22.5523 19.5523 23 19 23H5C4.44772 23 4 22.5523 4 22C4 21.4477 4.44772 21 5 21H6.02739C6.16267 18.5887 6.79004 16.7611 7.70965 15.2591C8.51183 13.9489 9.51962 12.9192 10.5126 12C9.51962 11.0808 8.51183 10.0511 7.70965 8.7409C6.79004 7.23887 6.16267 5.41131 6.02739 3H5C4.44772 3 4 2.55228 4 2ZM15.9691 21C15.8384 18.9511 15.3049 17.4797 14.5846 16.3034C13.8874 15.1645 12.9954 14.2641 12 13.3497C11.0046 14.2641 10.1126 15.1645 9.41535 16.3034C8.69515 17.4797 8.1616 18.9511 8.03092 21H15.9691ZM8.03092 3H15.9691C15.8384 5.04891 15.3049 6.52026 14.5846 7.6966C13.8874 8.83549 12.9954 9.73587 12 10.6503C11.0046 9.73587 10.1126 8.83549 9.41535 7.6966C8.69515 6.52026 8.1616 5.04891 8.03092 3Z'
                                        fill='currentColor'
                                    />
                                </g>
                            </svg>

                            <div className='mx-2 flex flex-[1] flex-col'>
                                <div className='text-[15px] font-medium'>Tuổi</div>
                                <p className='text-[13px] text-[#e4e6eb]/80'>{profileData.age}</p>
                            </div>
                        </div>

                        <div className='mt-3 flex items-center justify-between'>
                            <svg
                                className='h-[28px] w-[28px]'
                                fill='currentColor'
                                viewBox='0 0 256 256'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path d='M219.9978,23.95557q-.00219-.56984-.05749-1.13819c-.018-.18408-.05237-.36279-.07849-.54443-.02979-.20557-.05371-.41211-.09424-.61621-.04029-.20362-.09607-.40088-.14649-.60059-.04541-.18017-.08484-.36084-.13867-.53906-.05884-.19434-.13159-.38135-.19971-.57129-.06445-.17969-.12353-.36084-.19677-.5376-.07349-.17724-.15967-.34668-.24109-.51953-.08582-.18213-.16687-.36621-.26257-.54492-.088-.16455-.18824-.32031-.2837-.48047-.10534-.17627-.2052-.355-.32031-.52685-.11572-.17334-.24475-.33545-.369-.502-.11-.14746-.21252-.29834-.3302-.4414-.23462-.28614-.4834-.55957-.74316-.82227-.01782-.01807-.03247-.03809-.05054-.05615-.01831-.01856-.03857-.0332-.05688-.05127q-.39441-.38966-.82227-.74317c-.13965-.11474-.28686-.21435-.43042-.32177-.16992-.127-.33606-.25879-.51269-.377-.16883-.11328-.34424-.21093-.51734-.31445-.16333-.09765-.32324-.20019-.49145-.29-.1731-.09277-.3512-.1709-.52759-.25439-.17871-.08448-.35462-.17383-.538-.24951-.16932-.07032-.34229-.12647-.514-.18848-.19751-.07129-.39307-.14649-.59534-.208-.16882-.05078-.34045-.08789-.51086-.13135-.20874-.05322-.41529-.11132-.62818-.15332-.19055-.03759-.383-.05957-.57507-.08789-.19544-.02881-.38831-.06494-.58679-.08447-.33252-.03271-.666-.04541-.99988-.05078C208.11853,12.0083,208.0603,12,208,12H172a12,12,0,0,0,0,24h7.0293l-15.051,15.05127A71.97526,71.97526,0,1,0,108,178.981V192H88a12,12,0,0,0,0,24h20v16a12,12,0,0,0,24,0V216h20a12,12,0,0,0,0-24H132V178.981A71.928,71.928,0,0,0,180.27783,68.69287L196,52.9707V60a12,12,0,0,0,24,0V24C220,23.98486,219.9978,23.97021,219.9978,23.95557ZM120,156a48,48,0,1,1,48-48A48.05468,48.05468,0,0,1,120,156Z' />
                                </g>
                            </svg>

                            <div className='mx-2 flex flex-[1] flex-col'>
                                <div className='text-[15px] font-medium'>Giới tính</div>
                                <p className='text-[13px] text-[#e4e6eb]/80'>
                                    {profileData.sex === Sex.Male ? 'Nam' : 'Nữ'}
                                </p>
                            </div>
                        </div>

                        <div className='mt-3 flex items-center justify-between'>
                            <svg
                                className='h-[28px] w-[28px]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path
                                        d='M6 10V5M6 5L4 7M6 5L8 7M6 14V19M6 19L8 17M6 19L4 17M12 7H20M20 12H12M12 17H20'
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                    />
                                </g>
                            </svg>

                            <div className='mx-2 flex flex-[1] flex-col'>
                                <div className='text-[15px] font-medium'>Chiều cao</div>
                                <p className='text-[13px] text-[#e4e6eb]/80'>
                                    {profileData.height ? `${profileData.height} cm` : 'Chưa cập nhật'}
                                </p>
                            </div>

                            <div
                                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-[#f0f0f0]/10'
                                onClick={() => setIsOpenHeightList(true)}
                            >
                                <svg
                                    className='h-[24px] w-[24px] text-[#07e1ff]'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28'
                                    />
                                </svg>
                            </div>

                            <HeightList
                                isOpen={isOpenHeightList}
                                onClose={() => setIsOpenHeightList(false)}
                                onSelectHeight={(height: number) => setProfileData({ ...profileData, height })}
                            />
                        </div>

                        <div className='mt-3 flex items-center justify-between'>
                            <svg
                                className='h-[28px] w-[28px]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path
                                        d='M14 21.0001V15.0001H10V21.0001M19 9.77818V16.2001C19 17.8802 19 18.7203 18.673 19.362C18.3854 19.9265 17.9265 20.3855 17.362 20.6731C16.7202 21.0001 15.8802 21.0001 14.2 21.0001H9.8C8.11984 21.0001 7.27976 21.0001 6.63803 20.6731C6.07354 20.3855 5.6146 19.9265 5.32698 19.362C5 18.7203 5 17.8802 5 16.2001V9.77753M21 12.0001L15.5668 5.96405C14.3311 4.59129 13.7133 3.9049 12.9856 3.65151C12.3466 3.42894 11.651 3.42899 11.0119 3.65165C10.2843 3.90516 9.66661 4.59163 8.43114 5.96458L3 12.0001'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </g>
                            </svg>

                            <div className='mx-2 flex flex-[1] flex-col'>
                                <div className='text-[15px] font-medium'>Quê quán</div>
                                <p className='text-[13px] text-[#e4e6eb]/80'>
                                    {profileData.hometown || 'Chưa cập nhật'}
                                </p>
                            </div>

                            <div
                                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-[#f0f0f0]/10'
                                onClick={() => setIsOpenProfileHometownList(true)}
                            >
                                <svg
                                    className='h-[24px] w-[24px] text-[#07e1ff]'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28'
                                    />
                                </svg>
                            </div>

                            <HometownList
                                isOpen={isOpenProfileHometownList}
                                onClose={() => setIsOpenProfileHometownList(false)}
                                onSelectHometown={(hometown: string) => setProfileData({ ...profileData, hometown })}
                            />
                        </div>

                        <div className='mt-3 flex items-center justify-between'>
                            <svg
                                className='h-[28px] w-[28px]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g>
                                    <path
                                        d='M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M13 2.04932C13 2.04932 16 5.99994 16 11.9999C16 17.9999 13 21.9506 13 21.9506'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M11 21.9506C11 21.9506 8 17.9999 8 11.9999C8 5.99994 11 2.04932 11 2.04932'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M2.62964 15.5H21.3704'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M2.62964 8.5H21.3704'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </g>
                            </svg>

                            <div className='mx-2 flex flex-[1] flex-col'>
                                <div className='text-[15px] font-medium'>Ngôn ngữ</div>
                                <p className='text-[13px] text-[#e4e6eb]/80'>{profileData.language}</p>
                            </div>

                            <div
                                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-[#f0f0f0]/10'
                                onClick={() => setIsOpenProfileLanguageList(true)}
                            >
                                <svg
                                    className='h-[24px] w-[24px] text-[#07e1ff]'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28'
                                    />
                                </svg>
                            </div>

                            <LanguageList
                                isOpen={isOpenProfileLanguageList}
                                onClose={() => setIsOpenProfileLanguageList(false)}
                                onSelectLanguage={(language: Language) => setProfileData({ ...profileData, language })}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className='flex flex-col justify-center overflow-y-auto p-4'
                    style={{ width: `${100 / TOTAL_PAGES}%` }}
                >
                    <h2 className='text-center text-2xl font-semibold text-[#07e1ff]'>Bạn muốn hẹn hò với ai?</h2>
                    <ConfigProvider theme={{ token: { colorPrimary: '#07e1ff' } }}>
                        <Radio.Group
                            value={criteriaData.sex}
                            onChange={(e) =>
                                setCriteriaData((prevCriteria) => ({ ...prevCriteria, sex: e.target.value }))
                            }
                            className='mt-4 flex justify-center'
                        >
                            <Radio value={Sex.Male} className='lg:text-base'>
                                Nam
                            </Radio>
                            <Radio value={Sex.Female} className='lg:text-base'>
                                Nữ
                            </Radio>
                        </Radio.Group>
                    </ConfigProvider>
                </div>

                <div
                    className='flex flex-col justify-center overflow-y-auto p-4'
                    style={{ width: `${100 / TOTAL_PAGES}%` }}
                >
                    <h2 className='text-center text-2xl font-semibold text-[#07e1ff]'>
                        Bạn muốn hẹn hò với người có độ tuổi bao nhiêu?
                    </h2>
                    <p className='mx-auto mt-2 p-1 text-[13px] text-[#e4e6eb]/80'>
                        {criteriaData.age_range[0]} tuổi - {criteriaData.age_range[1]} tuổi
                    </p>
                    <ConfigProvider
                        theme={{
                            token: { colorPrimary: '#07e1ff', colorBgBase: '#e4e6eb' },
                            components: {
                                Slider: { handleColor: '#07e1ff' }
                            }
                        }}
                    >
                        <Slider
                            range
                            min={18}
                            max={65}
                            defaultValue={criteriaData.age_range}
                            tooltip={{ placement: 'bottom', formatter: (value) => `${value} tuổi` }}
                            onChange={(value) =>
                                setCriteriaData((prevCriteria) => ({ ...prevCriteria, age_range: value }))
                            }
                        />
                    </ConfigProvider>
                </div>

                <div
                    className='flex flex-col justify-center overflow-y-auto p-4'
                    style={{ width: `${100 / TOTAL_PAGES}%` }}
                >
                    <h2 className='text-center text-2xl font-semibold text-[#07e1ff]'>
                        Bạn muốn hẹn hò với người có chiều cao bao nhiêu?
                    </h2>
                    <p className='mx-auto mt-2 p-1 text-[13px] text-[#e4e6eb]/80'>
                        {criteriaData.height_range[0]} cm - {criteriaData.height_range[1]} cm
                    </p>
                    <ConfigProvider
                        theme={{
                            token: { colorPrimary: '#07e1ff', colorBgBase: '#e4e6eb' },
                            components: {
                                Slider: { handleColor: '#07e1ff' }
                            }
                        }}
                    >
                        <Slider
                            range
                            min={140}
                            max={220}
                            defaultValue={criteriaData.height_range}
                            tooltip={{ placement: 'bottom', formatter: (value) => `${value} cm` }}
                            onChange={(value) =>
                                setCriteriaData((prevCriteria) => ({ ...prevCriteria, height_range: value }))
                            }
                        />
                    </ConfigProvider>
                </div>

                <div
                    className='flex flex-col justify-center overflow-y-auto p-4'
                    style={{ width: `${100 / TOTAL_PAGES}%` }}
                >
                    <h2 className='text-center text-2xl font-semibold text-[#07e1ff]'>
                        Bạn muốn hẹn hò với người đến từ đâu?
                    </h2>
                    <div
                        className='mx-auto mt-2 flex cursor-pointer items-center gap-1 p-1 text-[13px] text-[#e4e6eb]/80'
                        onClick={() => setIsOpenCriteriaHometownList(true)}
                    >
                        <span>{criteriaData.hometown || 'Nhấn vào đây để lựa chọn'}</span>
                        <svg
                            className='h-[13px] w-[13px]'
                            fill='currentColor'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 52 52'
                        >
                            <g>
                                <path d='M8.3,14h35.4c1,0,1.7,1.3,0.9,2.2L27.3,37.4c-0.6,0.8-1.9,0.8-2.5,0L7.3,16.2C6.6,15.3,7.2,14,8.3,14z' />
                            </g>
                        </svg>
                    </div>
                    <HometownList
                        isOpen={isOpenCriteriaHometownList}
                        onClose={() => setIsOpenCriteriaHometownList(false)}
                        onSelectHometown={(hometown: string) => setCriteriaData({ ...criteriaData, hometown })}
                    />
                </div>

                <div
                    className='flex flex-col justify-center overflow-y-auto p-4'
                    style={{ width: `${100 / TOTAL_PAGES}%` }}
                >
                    <h2 className='text-center text-2xl font-semibold text-[#07e1ff]'>
                        Bạn muốn hẹn hò với người nói ngôn ngữ nào?
                    </h2>
                    <div
                        className='mx-auto mt-2 flex cursor-pointer items-center gap-1 p-1 text-[13px] text-[#e4e6eb]/80'
                        onClick={() => setIsOpenCriteriaLanguageList(true)}
                    >
                        <span>{criteriaData.language}</span>
                        <svg
                            className='h-[13px] w-[13px]'
                            fill='currentColor'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 52 52'
                        >
                            <g>
                                <path d='M8.3,14h35.4c1,0,1.7,1.3,0.9,2.2L27.3,37.4c-0.6,0.8-1.9,0.8-2.5,0L7.3,16.2C6.6,15.3,7.2,14,8.3,14z' />
                            </g>
                        </svg>
                    </div>
                    <LanguageList
                        isOpen={isOpenCriteriaLanguageList}
                        onClose={() => setIsOpenCriteriaLanguageList(false)}
                        onSelectLanguage={(language: Language) => setCriteriaData({ ...criteriaData, language })}
                    />
                </div>
            </div>

            {currentPage <= TOTAL_PAGES && (
                <div className='absolute inset-x-0 bottom-0 flex h-[80px] justify-evenly pt-4'>
                    {currentPage > 2 && (
                        <div
                            className='flex h-max cursor-pointer select-none items-center gap-1 p-1'
                            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                        >
                            <svg
                                className='h-[16px] w-[16px]'
                                style={{ transform: 'rotateY(180deg)' }}
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path d='M5.027 10.9a8.729 8.729 0 0 1 6.422-3.62v-1.2A2.061 2.061 0 0 1 12.61 4.2a1.986 1.986 0 0 1 2.104.23l5.491 4.308a2.11 2.11 0 0 1 .588 2.566 2.109 2.109 0 0 1-.588.734l-5.489 4.308a1.983 1.983 0 0 1-2.104.228 2.065 2.065 0 0 1-1.16-1.876v-.942c-5.33 1.284-6.212 5.251-6.25 5.441a1 1 0 0 1-.923.806h-.06a1.003 1.003 0 0 1-.955-.7A10.221 10.221 0 0 1 5.027 10.9Z' />
                            </svg>
                            <span className='text-sm underline'>Quay lại</span>
                        </div>
                    )}

                    <div
                        className='flex h-max cursor-pointer select-none items-center gap-1 p-1'
                        onClick={currentPage === TOTAL_PAGES ? handleSubmit : handleNextStep}
                    >
                        <span className='text-sm underline'>Tiếp tục</span>
                        <svg
                            className='h-[16px] w-[16px]'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path d='M5.027 10.9a8.729 8.729 0 0 1 6.422-3.62v-1.2A2.061 2.061 0 0 1 12.61 4.2a1.986 1.986 0 0 1 2.104.23l5.491 4.308a2.11 2.11 0 0 1 .588 2.566 2.109 2.109 0 0 1-.588.734l-5.489 4.308a1.983 1.983 0 0 1-2.104.228 2.065 2.065 0 0 1-1.16-1.876v-.942c-5.33 1.284-6.212 5.251-6.25 5.441a1 1 0 0 1-.923.806h-.06a1.003 1.003 0 0 1-.955-.7A10.221 10.221 0 0 1 5.027 10.9Z' />
                        </svg>
                    </div>
                </div>
            )}

            {currentPage > TOTAL_PAGES && (
                <Loading
                    loaderSize={40}
                    loaderClassName='!text-[#07e1ff]'
                    className='fixed inset-0 flex items-center justify-center bg-black/30'
                />
            )}
        </>
    )
}

export default DatingWelcome
