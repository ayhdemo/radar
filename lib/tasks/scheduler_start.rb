class Scheduler
	include Singleton

	def initialize
		@cm = ChainManager.instance
		@scheduler = Rufus::Scheduler.new
	end

	def start
		return unless @cm.lock  ## 进行锁定 && 判断是否锁定

		while true
			if ChainManager.m_setting.value == "true"  ## 开启中
				ChainManager.m_setting.touch
				on_schedule
			else
				on_unschedule
			end
			sleep 5
		end
	end

	def on_schedule
		if @scheduler.every_jobs.empty?
      $app_logger.warn self, "调度开启！"
      
      Chain.all.each do |chain|

        @scheduler.every '5s',first: :now, overlap: false do |job|     
          # $app_logger.warn self, "#{chain.chain_type}"
         	## TODO ： 应该需要增加异常处理 ？
          chain.reload  #重要！更新属性，获取DB中最新的配置 enabled 、 interval 进行更新
          if chain.enabled == true
          	if ChainManager.running
	          	 $app_logger.debug(self, "@@@@@@@@@@@@ 调度链 [#{chain.chain_type}] @@@@@@@@@@@@")
	          	 # chain.on_schedule
	        	end
	          if chain.interval > 5
	            job.next_time += chain.interval - 5
	          end
	        end
        end
        sleep 0.1
      end
    else
      # $app_logger.warn self, "调度中.."
    end
	end

	def on_unschedule
		if @scheduler.every_jobs.empty?
      $app_logger.warn self, "调度未开启.."
    else
      @scheduler.every_jobs.each(&:unschedule) ## 根据文档，这个并不会阻止当前任务执行完毕
      $app_logger.warn self, "ChainManager 调度关闭"
      @cm.unlock
    end
	end

end
  

Scheduler.instance.start