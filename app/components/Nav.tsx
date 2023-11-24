import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CottageIcon from '@mui/icons-material/Cottage';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';


const Nav = () => {
  return (
    <header className='w-[100vw]'>
        <nav className='nav'>
            <Link href='/'>
                <Image src='/Uel.png'
                width={300}
                height={300}
                alt='logo'
                priority >
                </Image>
            </Link>
            <div className=''>
                <Link href='/Home'>
                    <CottageIcon/>
                </Link>
                <Link href='/Doc'>
                    <FileOpenIcon />
                </Link>
                <Link href='/Reports'>
                    <BarChartIcon />
                </Link>
            </div>
            <div className=''>
                <Link href='/'>
                    <HelpOutlineIcon />
                </Link>
                <Link href='/'>
                    <PersonIcon />
                </Link>
            </div>
        </nav>
    </header>
  )
}

export default Nav