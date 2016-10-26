# -*- mode: ruby -*-
# vi: set ft=ruby :
# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "ubuntu/trusty64"

  # Create private network
  config.vm.network "private_network", ip: "33.33.33.15"
  config.vm.network "forwarded_port", guest: 9000, host: 9000
  config.vm.network "forwarded_port", guest: 9090, host: 9090

  # Using NFS to support gulp task runners
  config.vm.synced_folder("./", "/usr/share/nginx", :id => "vagrant",
    :nfs => true,
    :map_uid => 0,
    :map_gid => 48,
    :mount_options => ["nolock,vers=3,udp,noatime,actimeo=2"],
    :linux__nfs_options => ["no_root_squash"])

  # NFS can mess with our folder permissions, assign data to root.apache
  # so the app can function properly.
  # config.vm.provision "shell",
  # inline: "sudo chown -R root.apache /var/www/data"
  config.vm.provider "virtualbox" do |v|
    host = RbConfig::CONFIG['host_os']

    # Give VM 1/4 system memory & access to all cpu cores on the host
    if host =~ /darwin/
      cpus = `sysctl -n hw.ncpu`.to_i

      # sysctl returns Bytes and we need to convert to MB
      mem = `sysctl -n hw.memsize`.to_i / 1024 / 1024 / 2
    elsif host =~ /linux/
      cpus = `nproc`.to_i

      # meminfo shows KB and we need to convert to MB
      mem = `grep 'MemTotal' /proc/meminfo | sed -e 's/MemTotal://' -e 's/ kB//'`.to_i / 1024 / 2
    else # sorry Windows folks, I can't help you
      cpus = 2
      mem = 1024
    end

    v.customize ["modifyvm", :id, "--memory", mem]
    v.customize ["modifyvm", :id, "--cpus", cpus]
  end

  config.vm.provision "shell", path: "provision.sh"
end
# End of File
