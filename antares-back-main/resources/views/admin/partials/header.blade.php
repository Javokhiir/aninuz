<header class="header">
    <div class="d-flex align-items-center">
        <div class="flex-grow-1">
            @yield('breadcrumb')
        </div>
        <div class="flex-shrink-0">
            <nav class="navbar">
                <form class="search-wrap" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <span class="icon"><i class="bi bi-search"></i></span>
                </form>
                <ul class="nav">
                    {{-- <li class="nav-item dropdown notifications-menu">
                        <a class="nav-link dropdown-toggle" href="" data-bs-toggle="dropdown">
                            <span class="icon"><i class="bi bi-bell"></i></span>
                            <span class="badge bg-danger">1</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li  class="dropdown-item">
                                <a href="#">
                                    <div class="flex-shrink-0"><span class="icon primary"><i class="bi bi-percent"></i></span></div>
                                    <div class="flex-grow-1">
                                        <p class="title">Discount available</p>
                                        <p class="text">Morbi sapien massa, ultricies at rhoncus at, ullamcorper nec diam</p>
                                    </div>
                                </a>
                            </li>
                            <li  class="dropdown-item">
                                <a href="#">
                                    <div class="flex-shrink-0"><span class="icon primary"><i class="bi bi-percent"></i></span></div>
                                    <div class="flex-grow-1">
                                        <p class="title">Discount available</p>
                                        <p class="text">Morbi sapien massa, ultricies at rhoncus at, ullamcorper nec diam</p>
                                    </div>
                                </a>
                            </li>
                            <li  class="dropdown-item">
                                <a href="#">
                                    <div class="flex-shrink-0"><span class="icon primary"><i class="bi bi-percent"></i></span></div>
                                    <div class="flex-grow-1">
                                        <p class="title">Discount available</p>
                                        <p class="text">Morbi sapien massa, ultricies at rhoncus at, ullamcorper nec diam</p>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </li> --}}
                    {{-- <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="dropdown"><span class="icon"><i class="bi bi-moon-fill"></i></span></a></li> --}}
                    <li class="nav-item dropdown user-menu">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <div class="img-block"><span class="icon"><i class="bi bi-person"></i></span></div>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li class="dropdown-item"><a href="{{ dashboard_route('dashboard.profile') }}"><span class="icon"><i class="bi bi-person"></i></span> Account</a></li>
                            <li class="dropdown-item"><a href="{{ dashboard_route('dashboard.settings') }}"><span class="icon"><i class="bi bi-gear"></i></span> Settings</a></li>
                            <li class="dropdown-item">
                                <form action="{{ route('logout') }}" method="post">
                                    @csrf
                                    <button type="submit"><span class="icon"><i class="bi bi-box-arrow-right"></i></span> Logout</button>
                                </form>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</header>